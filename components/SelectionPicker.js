import React from 'react'
import RNPickerSelect from 'react-native-picker-select';

export default function SelectionPicker({data,setEditedTodo}) {
    
    
  return (
                  <RNPickerSelect
        onValueChange={(value) => setEditedTodo(value)}
        items={data}
        placeholder={{ label: "Select a category", value: null }}
      />
  )
}
