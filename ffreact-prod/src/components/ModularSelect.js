import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useGridApiContext } from '@mui/x-data-grid';
import { Input, InputAdornment } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const filter = createFilterOptions();

const CustomInput = ({params, fieldName, searchField, required}) => {
  return (
    // <TextField {...params} fullWidth name={searchField} required={required} />
    <div ref={params.InputProps.ref} style={{height: '100%', width: '100%', textAlign: 'center'}}>
    {/* <InputLabel htmlFor="component-filled" {...params.InputLabelProps}>Search...</InputLabel> */}
    <Input {...params.inputProps} disableUnderline sx={{height: '100%', width: '100%', margin: 0, paddingLeft: '16px'}} name={searchField} required={required}
      endAdornment={
        <InputAdornment><ArrowDropDownIcon></ArrowDropDownIcon></InputAdornment>
      }
    />
    </div>
  );
}

// Takes:
    // options - list of select options
    // searchField - The field of each option that will be the value selected/searched
    // selectedValue - The default value (Data already in this field)
    // required - Whether this TextField will be considered required in forms
    // id and field - Datagrid row params passed in renderEditCell
// Returns autocomplete select with add functionality
export default function ModularSelect({id, field, value, options, fieldName, searchField, required, onChange}) {
  const [selectValue, setSelectValue] = value ? React.useState({[searchField]: value}) : React.useState('');

  if (!options) {
    return <>loading...</>
  }

  // Remove duplicate options
  // Get array of all searchField values
  const optionSearchFields = options.map((options => options[searchField]));
  // Make set of that array (remove duplicates)
  const optionsSet = new Set(optionSearchFields);
  // Rebuild options array (key/value pairs)
  options = [...optionsSet].map((opt) => { return {[searchField]: opt} });
  // console.log(options);

  // If this is an editable column, use datagrid api to update cell
  if (id && field) {
    const api = useGridApiContext();
    React.useEffect(() => {
        api.current.setEditCellValue({id, field, value: selectValue[searchField], debounceMs: 200})
    }, [selectValue])
  }

  return (
    // <ThemeProvider theme={filledInputTheme}>
    <Autocomplete
      value={selectValue}   
      onChange={(event, newValue) => {
        // Use passed onChange callback to set parent value
        if (onChange) {
            // Using handleFormChange here -> passing event.target with name and value
            onChange({target: 
                {
                    name: fieldName ? fieldName : searchField,
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
      // sx={{ width: '100%', height: '100%' }}
      selectOnFocus
      clearOnBlur
      disableClearable
      // handleHomeEndKeys
      // freeSolo
      renderInput={(params) => {
        if (onChange) {
          return (<TextField {...params} name={fieldName ? fieldName : searchField} required={required}/>);
        }
        else {
          return (<CustomInput params={params} searchField={searchField} required={required}/>);
        }
      }}
    />
    // </ThemeProvider>
  );
}