import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const ChapterSlider = ({ progress, maxChapters, onChange }) => {
  const [sliderValue, setSliderValue] = useState(parseInt(progress.split(' / ')[0]));

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    onChange(`${newValue} / ${maxChapters}`); // Update progress value
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Slider
        aria-label="Chapters"
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
