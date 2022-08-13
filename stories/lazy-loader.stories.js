import { LazyImage } from "../src/web-components/lazy-loader";

export default {
    title: 'Components/Lazy Loader',
};
  
const Template = () => `
                        <div>Testing</div>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <evanesce-tag
                            type="iframe"
                            attribute="src=>https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d507365.3245583991!2d3.0037633095566476!3d6.547977480168733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2suk!4v1632064524617!5m2!1sen!2suk;width=>100%;height=>250;title=>W3Schools Free Online Web Tutorials;style=>border:none;"    
                        ></evanesce-tag>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <lazy-tag
                            type="iframe"
                            attribute="src=>https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d507365.3245583991!2d3.0037633095566476!3d6.547977480168733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2suk!4v1632064524617!5m2!1sen!2suk;width=>100%;height=>250;title=>W3Schools Free Online Web Tutorials;style=>border:none;"
                        ></lazy-tag>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <lazy-picture 
                            src="https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ"
                            alt="nice picture"
                            srcset="450=>https://i.picsum.photos/id/1/5616/3744.jpg?hmac=kKHwwU8s46oNettHKwJ24qOlIAsWN9d2TtsXDoCWWsQ;700=>https://i.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68;"
                        ></lazy-picture>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <lazy-image style="width:100%;height:400px;padding: 5px;" src="https://images.unsplash.com/photo-1504272017915-32d1bd315a59?fit=crop&w=600&q=80"></lazy-image>
                        <lazy-image style="width:100%;height:400px;" src="https://images.unsplash.com/photo-1502716643504-c4ea7b357d91?fit=crop&w=600&q=80"></lazy-image>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <p>Test</p>
                        <lazy-image style="width:100%;height:400px;" src="https://images.unsplash.com/photo-1502716716838-6ad177344906?fit=crop&w=600&q=80"></lazy-image>
                        <lazy-image style="width:100%;height:400px;" src="https://images.unsplash.com/photo-1504271933050-2cf260bbec95?fit=crop&w=600&q=80"></lazy-image>
                        <lazy-iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d507365.3245583991!2d3.0037633095566476!3d6.547977480168733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2suk!4v1632064524617!5m2!1sen!2suk" height="250"></lazy-iframe>
                        <show-more>Add more</show-more>
                        <div>Testing two</div>`; 
  
export const LazyImagesTag = Template.bind({});
LazyImagesTag.args = {};