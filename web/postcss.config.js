import openProps from 'open-props';
import jitProps from 'postcss-jit-props';
import nesting from 'postcss-nesting';

const config = {
  plugins: [nesting(), jitProps(openProps)],
};

export default config;
