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
export default function NewModularSelect({id, field, name, value, options, fieldName, getOptions, searchField, required, onChange}) {
  const [selectValue, setSelectValue] = value ? React.useState({[searchField]: value}) : React.useState('');

  if (!field) {
    field = name;
  }
  if (!searchField) {
    searchField = name;
  }

  if (!options) {
    return <>loading...</>
  }

  // Remove duplicate options
  // Get array of all searchField values
  const optionSearchFields = options.map((option => option[searchField]));
  // Rebuild options array (key/value pairs)
  options = optionSearchFields.map((opt) => { return {[searchField]: opt} });

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
        } else {
            setSelectValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;

        return filtered;
      }}
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
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
      renderOption={(props, option) => {
        console.log(option);
        return (
            <li {...props} key={option.id}>{option[searchField]}</li>
        )
      }}
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