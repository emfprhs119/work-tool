import React, { CSSProperties } from 'react';
import PropTypes from 'prop-types';
import IcomoonReact from 'icomoon-react';
import iconSet from './selection.json';

const Icon = (props: { size?: number; icon: string; className?: string; style?: CSSProperties | undefined }) => {
  const { size, icon, className, style } = props;
  return <IcomoonReact className={className} iconSet={iconSet} size={size} icon={icon} style={style} />;
};

Icon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Icon.defaultProps = {
  className: '',
  size: '100%',
};

export default Icon;
