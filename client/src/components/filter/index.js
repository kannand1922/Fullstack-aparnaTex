import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import "./style.scss";
const FilterSection = ({
  searchQuery = "",
  setSearchQuery,
  sortOrder,
  handleSortChange,
  clearFilters,
}) => {
  return (
    <div className="filter-section">
      <div className="filter-header">
        <IconButton className="filter-icon">
          <FilterListIcon />
        </IconButton>
        <h2 className="filter-title">Filter & Sort</h2>
        <IconButton className="clear-filter" onClick={clearFilters}>
          <ClearIcon />
        </IconButton>
      </div>
      <div className="filter-body">
        <div className="filter-group">
          <FormControl fullWidth size="small">
            {/* <InputLabel id="search-label">Search</InputLabel> */}
            <TextField
              id="search-input"
              variant="outlined"
              placeholder="Search Products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              label="Search"
            />
          </FormControl>
        </div>
        <div className="filter-group">
          <FormControl fullWidth size="small">
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              id="sort-select"
              value={sortOrder}
              onChange={handleSortChange}
              displayEmpty
              label="Sort By"
            >
              <MenuItem value="" disabled>
                Sort
              </MenuItem>
              <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
              <MenuItem value="highToLow">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
