import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useGridApiContext } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material';
// import { Input } from '@mui/material';

const filter = createFilterOptions();

// Takes:
    // options - list of select options
    // searchField - The field of each option that will be the value selected/searched
    // selectedValue - The default value (Data already in this field)
    // required - Whether this TextField will be considered required in forms
    // id and field - Datagrid row params passed in renderEditCell
// Returns autocomplete select with add functionality

const filledInputTheme = createTheme({
  overrides: {
    MuiFilledInput: {
      root: {
        backgroundColor: "white",
      }
    }
  }
});

export default function ModularSelect({id, field, value, options, searchField, required, onChange}) {
  const [selectValue, setSelectValue] = value ? React.useState({[searchField]: value}) : React.useState();

  // Remove duplicate options
  // Get array of all searchField values
  const optionSearchFields = options.map((options => options[searchField]));
  // Make set of that array (remove duplicates)
  const optionsSet = new Set(optionSearchFields);
  // Rebuild options array (key/value pairs)
  options = [...optionsSet].map((opt) => { return {[searchField]: opt} });


  // If this is an editable column, use datagrid api to update cell
  if (id && field) {
    const api = useGridApiContext();
    React.useEffect(() => {
        api.current.setEditCellValue({id, field, value: selectValue[searchField], debounceMs: 200})
    }, [selectValue])
  }

  return (
    <ThemeProvider theme={filledInputTheme}>
    <Autocomplete
      value={selectValue}   
      onChange={(event, newValue) => {
        // Use passed onChange callback to set parent value
        if (onChange) {
            // Using handleFormChange here -> passing event.target with name and value
            onChange({target: 
                {
                    name: searchField,
                    value: newValue[searchField]
                }
            });
        }
        if (typeof newValue === 'string') {
          setSelectValue({
            [searchField]: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setSelectValue({
            [searchField]: newValue.inputValue,
          });
        } else {
          setSelectValue(newValue);
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
            [searchField]: inputValue
            // [searchField]: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
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
      isOptionEqualToValue={() => true}
      // renderOption={(props, option) => <li {...props}>{option[searchField]}</li>}
      size='small'
      sx={{ width: '100%', height: '100%' }}
      selectOnFocus
      clearOnBlur
      disableClearable
      // handleHomeEndKeys
      // freeSolo
      renderInput={(params) => (
        <TextField variant='filled' fullWidth={true} sx={{alignItems: 'center', justifyItems: 'center'}} {...params} name={searchField} required={required} />
      )}
    />
    </ThemeProvider>
  );
}