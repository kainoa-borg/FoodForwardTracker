import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

// Takes:
    // options - list of select options
    // searchField - The field of each option that will be the value selected/searched
    // selectedValue - The default value (Data already in this field)
    // isRequired - Whether this TextField will be considered required in forms
// Returns autocomplete select with add functionality
export default function ModularSelect({options, searchField, selectedValue, isRequired}) {
//   const options = props.options;
//   const searchField = props.searchField;
  if (isRequired === undefined) isRequired = false;
  if (selectedValue === undefined) selectedValue = null;
  
  const [value, setValue] = React.useState(selectedValue);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            [searchField]: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            [searchField]: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option[searchField]);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            [searchField]: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      disableClearable
      handleHomeEndKeys
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option[searchField];
      }}
      renderOption={(props, option) => <li {...props}>{option[searchField]}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} required={isRequired} label="Select..." />
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
];