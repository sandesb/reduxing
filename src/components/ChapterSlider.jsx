import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Custom styled slider using #a2b5ea color
const CustomSlider = styled(Slider)(({ theme }) => ({
  color: '#a2b5ea', // Custom color
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${alpha('#a2b5ea', 0.16)}`,
    },
    '&.Mui-active': {
      boxShadow: `0px 0px 0px 14px ${alpha('#a2b5ea', 0.16)}`,
    },
  },
  '& .MuiSlider-rail': {
    color: alpha('#a2b5ea', 0.2), // Slightly lighter rail
  },
  '& .MuiSlider-track': {
    color: '#a2b5ea', // Custom track color
  },
}));

const ChapterSlider = ({ progress, maxChapters, onChange }) => {
  const [sliderValue, setSliderValue] = useState(parseInt(progress.split(' / ')[0]));

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    onChange(`${newValue} / ${maxChapters}`); // Update progress value
  };

  return (
    <Box sx={{ width: '100%' }}>
      <CustomSlider
        value={sliderValue}
        onChange={handleSliderChange}
        step={1}
        marks
        min={1}
        max={maxChapters}
        valueLabelDisplay="auto"
      />
    </Box>
  );
};

export default ChapterSlider;
