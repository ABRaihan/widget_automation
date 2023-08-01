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
          __and: [{ isViewAllBtn: true }, { isViewBtn: false }, { __or: [{ isValue: true }, { isName: "yes" }] }],
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
      value: "I am heading ana ab",
      fallback: [""],
    },
  },
};