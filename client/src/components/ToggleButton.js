import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';

function StandaloneToggleButton({ firstColor = 'primary', secondColor = 'secondary', ...props }) {
  // const { theme = 'secondary', label = 'Button Text', ...restProps } = props;

  const [selected, setSelected] = React.useState(false);

  return (
    <ToggleButton
    value="check"
    selected={true}
    size='large'
    color={selected ? firstColor : secondColor }
    sx={{ borderRadius: '50%' }}
    onChange={() => {
      setSelected(!selected);
    }}
    >
      { props.component }
    </ToggleButton>
  );
}

export default StandaloneToggleButton;
