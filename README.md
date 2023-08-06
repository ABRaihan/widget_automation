# Soppiya Widget

Widget refers to an application component that can be embedded within a larger application or website. Widgets are designed to provide specific functionalities or display specific information to users in a compact and visually appealing manner.

<!-- #__authors details__# -->

## Authors

- [@soppiya](https://www.soppiya.com)

## How to build soppiya widget! 👋

### Get start with:

- [Folder structure](#folder-structure)
- [Folder boilerplate](#folder-boilerplate)
- [Code boilerplate](#code-boilerplate)
- [Make config file](#make-config-file)
- [How to start build an widget](#how-to-start-build-an-widget)

<!-- #__folder structure__# -->

### Folder structure:

- [src/](.\widgets\src)
  - [widgets/](.\widgets\src\widgets)
    - [Blog/](.\widgets\src\widgets\Blog)
    - [Blogs/](.\widgets\src\widgets\Blogs)
    - [category/](.\widgets\src\widgets\category)
    - [combo/](.\widgets\src\widgets\combo)
    - [flash/](.\widgets\src\widgets\flash)
    - [foot/](.\widgets\src\widgets\foot)
    - [head/](.\widgets\src\widgets\head)
    - [home/](.\widgets\src\widgets\home)
      - [banner/](.\widgets\src\widgets\home\banner)
      - [carousel/](.\widgets\src\widgets\home\carousel)
        - [liquid/](.\widgets\src\widgets\home\carousel\liquid)
      - [category/](.\widgets\src\widgets\home\category)
      - [code/](.\widgets\src\widgets\home\code)
      - [combo/](.\widgets\src\widgets\home\combo)
      - [flash/](.\widgets\src\widgets\home\flash)
      - [items/](.\widgets\src\widgets\home\items)
        - [alpha/](.\widgets\src\widgets\home\items\alpha)
      - [trending/](.\widgets\src\widgets\home\trending)
      - [video/](.\widgets\src\widgets\home\video)
    - [item/](.\widgets\src\widgets\item)
    - [items/](.\widgets\src\widgets\items)
- [.env](.\widgets.env)
- [.gitignore](.\widgets.gitignore)
- [gulpfile.js](.\widgets\gulpfile.js)
- [package.json](.\widgets\package.json)
- [README.md](.\widgets\README.md)
- [main.js](.\widgets\main.js)
- [yarn.lock](.\widgets\yarn.lock)

> **_Describe:_** This is the widget folder structure. Working folder is widgets. Don't need to touch others files or folder expect .env file. In widgets folder you get some folder like blog, home, flash etc. These are like page name if you think a website. We can see each page has multiple section. Like a website home page we can see carousel and others section. These are the actually we called widgets. So each page folder you can see multiple widgets folder. We have lots of widgets. For example we have 5 types of carousel widgets. Like liquid carousel, galaxy carousel. Each carousel widget we keep in "widgets/home/carousel" folder.

### Folder boilerplate:

```
carousel
  js/
  index.html
  config.js
  readme.md
```

> **_Describe:_** A widget folder structure will be like this. In js folder keep your all module js file. Not main js file. The main js keep in script tag index.html. All CSS codes write into index.html as internal CSS. The config.js is most important file. Here you have to write customization config of your widgets. The README.md file is for if you want to share important description about the widget.

### Code boilerplate:

```html
index.html

<section>
  <style>
    /* write you style here */
  </style>
  <div>
    <!-- write your html code here -->
    <h1>Build Your Awesome Widget</h1>
  </div>
  <script type="module">
    import Transform from "lib/transform";
    import widgetSettings from "./js/widgetSetting";

    function main() {
      const settings = Transform.toValue(widgetSettings);
    }
    main();
  </script>
</section>
```

### Make config file:

```md
types of widget customization

- color
- shadow
- border
- radius
- padding
- range
- image
- category
- item
- blog
- select
- text
- textarea
- html
```

> **_Describe:_** These all are widgets types. When you build widget configuration you must be define these type.

```javascript
/* @__setting object look like__@ */

/*
  * bgColor - setting name parser use name for insert dynamic value
  * name - this value will show as title in theme editor
  * type - widget customization type.
  * parseType - this is the data type of setting value. it's mean which type value insert replace the parser.
  * fallback - fallback is backup value. if parser value not set then fallback value will insert. fallback value must be an array. if you want to empty just [""] write this.
  * activation - sometimes settings are depend on other settings. if that setting available then it's setting will work. so here you can write the logic in the way of below
*/
{
  bgColor: {
      name: "Background Color",
      icon: "https://soppiya.com/icons/colorPicker.png",
      type: "color",
      parseType: "string",
      value: "#fff",
      fallback: ["var(--backgroundColor)", "#fff", ""],
      activation: [
        {
          __and: [{ isViewAllBtn: true }, { isViewBtn: false }, { __or: [{ isValue: true }, { isName: "yes" }] }, {__ne: {isShow: false}}],
        },
      ],
    },
}
```

> **_Describe:_** This is the example of how to make widget setting.

```javascript
/* @__config object look like__@ */

module.exports = {
  general: {
    bgColor: {
      name: "Background Color",
      icon: "https://soppiya.com/icons/colorPicker.png",
      type: "color",
      parseType: "string",
      value: "#fff",
      fallback: ["var(--backgroundColor)", "#fff", ""],
      activation: [
        {
          __and: [
            { isViewAllBtn: true },
            { isViewBtn: false },
            { __or: [{ isValue: true }, { isName: "yes" }] },
            { __ne: { isShow: false } },
          ],
        },
      ],
    },
    bgImage: {
      name: "Background Image",
      icon: "https://soppiya.com/icons/image.png",
      type: "image",
      size: [1920, 773],
      parseType: "boolean",
      value: true,
      fallback: [""],
    },
  },
  Header: {
    headerAlignment: {
      name: "Heading alignment",
      icon: "https://soppiya.com/icons/questionMark.png",
      type: "select",
      options: [
        {
          name: "Left",
          value: "left",
          icon: "https://soppiya.com/icons/alignmentLeft.png",
        },
        {
          name: "Right",
          value: "right",
          icon: "https://soppiya.com/icons/alignmentCenter.png",
        },
        {
          name: "Center",
          value: "center",
          icon: "https://soppiya.com/icons/alignmentRight.png",
        },
      ],
      parseType: "string",
      value: "left",
      fallback: ["right"],
      activation: [
        {
          __and: [{ isViewAllBtn: true }, { isViewBtn: false }, { __or: [{ isValue: true }, { isName: "yes" }] }],
        },
      ],
    },
    headingText: {
      name: "Heading text",
      icon: "https://soppiya.com/icons/text.png",
      type: "text",
      parseType: "string",
      value: "I am heading gibon",
      fallback: [""],
    },
  },
};
```

> **_Describe:_** This is the actual config.js file. Here you can she some root object like general, header. Actually these the section. Like bgColor & bgImage settings is include under general section.

### How to start build an widget:

For build a widget you need to follow a simple step.

- First you just write widget path in .env file. For example you want to create a carousel widget under the home folder. So write:

```env
SOURCE_DIRECTORY="./src/widgets/home/carousel"
// you just write "./src/widgets/home/carousel" this.
```

- Second you just run a command in your terminal

```bash
yarn dev
```

> **_Describe:_** This command automatically create all folder structure for you. You just go to folder and write your widget code.

- After complete your widget you just run build command.

```bash
yarn build
```

> **_Describe:_** After build command it's automatically build the production file index.html, settings.json and settings.editor.json.

Your widget build is complete as simple as.
