import React, { Component } from 'react';
import { sortableContainer, sortableElement, arrayMove, arrayInsert, DragLayer } from './react-sortable-multiple-hoc';
import './SortableComponent.css';

const dragLayer = new DragLayer();

const SortableService = sortableElement(props => {
  return (
    <div
      onClick={props.onSelect}
      className={props.className}
    >
      <span style={{ display: 'inline-block', width: '50px' }}>{props.item.order}</span>
      {props.item.service}
    </div>
  );
});

const SortableListServices = sortableContainer(({ items }) =>
  <div>
    {items.map((service, index) => (
      <SortableService
        key={index}
        index={index}
        item={service}
      />
    ))}
  </div>
);

const SortableGroup = sortableElement(props =>
  <div>
    <div>
      <span style={{ backgroundColor: 'blue', color: 'white'}}>{props.item.name}</span>
    </div>
    <SortableListServices
      {...props} // onMultipleSortEnd
      items={props.item.items}
      dragLayer={dragLayer}
      distance={3}
      helperClass={'selected'}
      isMultiple={true}
      helperCollision={{ top: 0, bottom: 0 }}
    />
  </div>
);

const SortableListGroups = sortableContainer(({ items, onSortItemsEnd }) =>
  <div>
    {items.map((group, index) => (
      <SortableGroup
        key={index}
        index={index}
        item={group}
        id={index}
        onMultipleSortEnd={onSortItemsEnd}
      />
    ))}
  </div>
);

export default class SortableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [
        {
          type: 'top',
          name: 'E',
          items: []
        },
        {
          name: 'Private',
          items: [
            'WhatsApp',
            'Messenger'
          ]
        },
        {
          type: 'top',
          name: 'E',
          items: []
        },
        {
          name: 'Job',
          items: [
            'Slack',
            'Github'
          ]
        },
        {
          type: 'top',
          name: 'E',
          items: []
        },
      ],
    };
  }
  
  onSortEnd = ({ oldIndex, newIndex }) => {
    let groups = arrayMove(this.state.groups, oldIndex, newIndex);
    groups = arrayInsert(groups, newIndex + 1, {
      type: 'top',
      name: 'E',
      items: []
    });
    groups = arrayInsert(groups, newIndex, {
      type: 'top',
      name: 'E',
      items: []
    });
    this.setState({ groups });
  }

  onSortItemsEnd = ({ newListIndex, newIndex, items }) => {
    // console.log(newListIndex, newIndex, items)
    const parts = this.state.groups.slice();
    const itemsValue = [];

    items.forEach(item => {
      itemsValue.push(parts[item.listId].items[item.id]);
    });
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];

      parts[item.listId].items.splice(item.id, 1);
    }
    parts[newListIndex].items.splice(newIndex, 0, ...itemsValue);
    this.setState({
      groups: parts,
    });
  }
  
  render() {
    const groups = this.state.groups.map((group, index) => {
      return {
        name: group.name,
        items: group.items.map((service, order) => {
          return {
            service,
            order: (index + 1) + '.' + (order + 1),
          };
        }),
      };
    });

    return (
      <div>
        <SortableListGroups
          items={groups}
          onSortEnd={this.onSortEnd}
          onSortItemsEnd={this.onSortItemsEnd}
          helperClass={'selected'}
          // shouldCancelStart={}  
        />
      </div>
    );
  }
}
