import { GlassLayer } from "../src/web-components/glass-layer";

export default {
    title: 'Components/Glass Layer',
};
  
const Template = () => `<div style="width:100%;background-color:red;height:100%;padding: 5px"><glass-display></glass-display></div>`; 
  
export const GlassLayerTag = Template.bind({});
GlassLayerTag.args = {};