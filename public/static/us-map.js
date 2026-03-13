(function () {
  var PATHS = {
    AL: "M628.5,466.4l-1.6-22.1l-2.5-19.3l-4.5-25.4l11.3-1.6l22.4-2.8l16.3-2.5l4.9,18.3l5.2,24.6l2.1,14l1.7,16.2l1.4,6.4l-5.4,2l-1.4,4.2l1.2,2.7l-1,3.5l-10.4,1.4l-24.2,3.3l-5.3-3.7l0.3-6.1l2.1-7.1l2.3-4.7l-1-3.7l-3.2-0.7l0.3-4.1",
    AK: "M161.1,553.5l-0.3,85.4l1.6,1l3.1,0l1.5-1.1l0-2l3.1,0l0.1,2.3l5.3,0l5.4,0l0-3.2l1.5-1.6l1.1-0.1l0.5,1.9l2.8,0l0.6-2.2l2.6-1.5l3.1-0.2l2.3,2.3l2,0l2.7-1.9l1.7,1.1l-0.1,2l3.8,0.5l0.8,2.4l4.5,0l1.4-0.4l2.7-1.7l0.6,0.4l0.7,2.1l6.5,0l1.8-2.6l-0.2-1.6l-3-0.1l-0.7-2.7l-2.5-1.4l2.5-4.7l4.1-0.2l0.5-2.3l-3.4-2.9l-0.3-3.3l7.6-0.1l2.2-3.6l-1.1-1.8l-3.5,1.1l-4.4-1.3l-5.2-0.5l-2.8-2.7l-3.4-0.1l-2.2-2.9l-4.2-4.4l-3.7,0.1l-1.8,-2.1l2.9-3.6l5.4-3.4l3-1.2l3.2-3.4l4.8-1.3l3.6,1.2l0.5,3.8l4.7-0.2l2.8,-2.4l0.2-3.5l-1.9-4.3l-3.7-6.5l-1.6-0.7l-0.1,2.4l-4.7,-3.8l0.2-1.2l3.2-1.1l0.5-4.8l1.4-4.2l-0.2-3.4l-6-1.4l1.1-2.3l-3.5-3.3l5.2-3l-2.4-2.3l-2.7,1.7l-5.2,-0.3l-7,3.2l-4.5,3l-0.3,1.7l3,2l-3.3,4.6l-4.3,4.3l-2,3.3l-4.9,1l0.1-4.7l1-1.8l-0.6-2.4l-5.9,4.3l-4.2,3.8l-6.2,3.6l-2.5,3.4l-6.6,4.5l-3.7,1l-2.6,-0.2l-6.6,3l-2,2.4l-3.6-0.5l3.1-2.7l3.7-2l2.1-2.6l3.7-2l0.8-1.3l-2.9,0.1l-6.2,2.5l-5.7,2l-1.2,-2.1l-3.7,2.1l-1.5,3.2l-3.7,0.8l-2.5-0.2l-4.1,1.2l-2.2-1.7l-5.3,3.1l0.1,1.4l4.6,0.5l-5.6,4.2l-6.3,3.6l-3.4,3.3l-0.1,2.7l-4.8,4.8l-6.5,3.8l-0.1-8.6",
    AZ: "M137.7,449.8l1.4-4l3.1-3.5l0.3-2.4l0.5-0.7l-1.1-1.8l-2-4.5l-1.3-3l-3.5-4.2l-0.2-1.3l1.3-3.2l-0.1-5.1l-0.8-2l3.1-5.2l0.7-4l0.8-5.1l2.9-0.2l20.9,3.1l19.5,2.7l16,1.8l-1.1,10l-1.2,8.1l-2.2,15.1l-0.7,5.1l4.3,0l2.2,2.3l3.6,-0.3l5.2,4.3l2.5,0.3l1.2-1l2.1,2l0,6.3l-6.3,3.5l-9.1,-0.1l-3.2,0.4l-1.1,2.3l-5.8,2.3l-2.2,1.2l-0.3,4.2l-1.9,0l0,0l-23.9-3.6l-2.3-16.2l-0.5-2.3l-2.1-0.6l-0.8-2.8l-13.6-8l-2.1-1.2",
    AR: "M581.3,415.4l-4.1-2.8l-0.3-3.6l-3.1-3.1l-0.2-7.2l25.2-1.2l22.2-1.5l11.3-1.2l-0.2,6.7l3.2,4.1l-1,4l-3.7,2l-2.4,3.1l0.8,3.6l0.2,4.2l3.4,3.2l0.3,1.9l-2.2,4.1l-4.1,1l-0.5-2.2l-3.3,0.7l-3.1,3.2l-2.5-0.1l-2,2.1l-2,0.6l-13.6,1l-14.3,1l-5.5,0.3l0.2-5l-2.3-3.3l2.2-4l0-4.5l2.5-4.1l-2.6-2.5",
    CA: "M79.5,344l-6.2-0.7l-2.3-2.3l0.4-2.3l1.3-2.2l-2-5.6l-3.8-5.1l1.6-4.2l-0.8-5.3l-2.2-4.7l1.2-3.1l-3.1-2.1l-3.2-8.4l-2.3-5.1l6.2-0.2l4.1-8.1l-2.1-2.2l-0.7-4.1l-3.2-5.1l-2.9-7.2l0.2-3.7l-2.7-4.1l3.2-8.2l2.3-1.6l-0.5-9l-1.8-3.1l-0.4-5.6l1.2-3.7l3-3.9l0.2-5.3l-1.3-3.6l0.7-2.3l2.2-2.2l-0.2-11.1l-1.6-3.1l-1.3-6l1.2-0.6l14.3,2.1l2.9,5.1l2.3,3.1l0.9,5.1l5.2,7.3l-0.3,1.2l-3.7,0.1l-1.6,2.6l0.5,2.9l3.6,4.1l2.3,4.2l0.9,4.2l2.6,4.5l0.1,3l-1.2,1l-0.3,2.7l2.3,5l1.2,5l3.3,4.3l-0.3,3.5l1.3,2.3l-0.6,3.7l-0.6,4l2.6,3.7l0.2,2.4l-1.2,5.4l0.7,3.5l2.3,1.2l1.3,3.3l-0.5,2.1l2.5,4.2l4.3,0.2l3.1,1.6l-0.1,7.5l0.1,7.2l-0.7,0.1l-8.2,0.5l-2.2-1l-3.7,3.3l-3,5.7l-0.6,4.2l1,4.1l-2,4l-3.2-0.1l-1.9,2.2l-5.1-6.1l-3.2-0.7l-4.7-3.7",
    CO: "M276.1,310.2l-0.1-2.3l-38.2-3.3l-25.4-2.7l-21.3-2.8l3.4-30.1l3-26l13.5,1.3l23.4,2.3l24.2,1.8l24.1,1.3l-1.3,16.9l-1.4,21.2l-0.7,10.1l-3.1,7.3l0.6,5.1",
    CT: "M852.3,190.5l-0.3-3l-1.7-5.2l2-2.2l3.3-3.7l4.2-1.2l9.2-3.1l1.3,2.2l1.3,5.3l0.3,5.7l-2.6,1.6l-5.1,2.1l-7.9,3.4l-3.3-0.5",
    DE: "M816.1,273l-0.1-2.2l-3.3-1.1l-2.5-4.2l-2.5-2.7l1.2-4.8l1.2-2.1l-2.3-0.5l-0.5,1.2l-1.2,0.3l-1.2-3l4.6-1l5.3-0.3l1,6.9l1.4,5.2l-0.4,4.3l-0.6,3.6",
    DC: "M790.5,287.3l-1.6-1.6l1-2.6l2.8,0.4l0.6,1.3l-0.6,1.2l-1,0.8",
    FL: "M715.3,498.7l2.2,8.2l3.8,8.5l4.8,5.9l3.2,5.3l4.3,8.3l4.2,3.1l1,3.3l-0.3,3.1l3.2,5.2l0.1,3.2l-1.1,1.2l-2.2,1.6l-0.1,2.4l1.2,2.1l1,2.2l-0.3,4.7l-2.3,2.1l-2.9,-1.8l-2.3,1.2l-1.1,2.1l-4.5,1.6l-1.3,-1.1l-3.7,0l-4.2,-3.5l-3.5,-4l-2.6,-4.2l-2.1,-4.1l-2.3,-1.6l-1.5,-3.3l-4.3,-5.1l-3.7,-7l-2.8,-4.6l-0.8,-3.2l-2.8-2.3l-0.7,0.7l-3.7,-7.1l-1,-4.1l1.2,-2.1l-2.2,-3.6l0.5,-0.8l0.3,-3.3l2.9,-3.4l6,-4.1l4.2,0.5l5.7,3.4l9.2,0.8l6.9,1l3.2,-0.5l2.8,2.8l-2.3,2.1l-0.3,1.3l3.1,3.1l0.5,-3.4l1.1,-2.5l-0.5-2.2l-3.6-3.5l6.8,0.2l28.2,3.1l5.2,0.1l-2.7,3.7l-3.5,1.3l1.6,4.3l3.2,1l2.6,-2.2l0.1,-2.3l2.1,-2.8l3,2.1l1.2,5.7l-0.3,3.3l1.2,4.2l2.1,1.1l-0.1,3.5l-1,3.9l-2.7,1.2l0.1,5.4l1.4,3.4l0.2,3.5l-0.3,3.8l-2.2,6.5l0.1,3.3l-1.3,8.8l-1.3,3.1l-0.5,6.8l-2.1,6.3l-2.2,2.5l-2.6,5.8l-4.3,6.2l-2.3,0.6l-1,3.2l-3.6,4.2l-2.3,0.6l-4.2,4.2l-3.5,1.7l-3.1,4.3l0.1,2.3l-3.3,0.3l-3-1.7l-3.2-3.1l-0.7-3.8l-2.2-1l-2.3-2.1l-5.2-0.7l-2.3-2l-3.2-0.4l-1.1-1.5l-2.3,0.8l-4.3-1.7l-1.2-3l-4.2-2l-1.8-2.7l-3.9-1.2l-0.2-2.2l1.3-2.6l3.8-3.9l0-4.2l-3.2-1.6l-5.2-0.3l-5.3-3.2l-3.7-0.5l0.2-3.2l-7.2-2.3l-4.2-3l-6.1,0.1l-2.3-2l-5.3-0.3l-3.2,2.3l-5.3,0l-5.6-2.2",
    GA: "M700.1,430.8l-3.2,0.3l-5.3,0.8l-20.3,2.8l-5.2,0.5l2.2,14.6l2.2,15.1l2.9,13.1l1.2,7.1l5.3-0.3l4.8-0.8l1.3,3.2l3.5,5.2l3.7,2.8l2.5,4.1l0.1,5.3l2.3,5.5l3.1,0.5l1.2,2.7l3.2,2.5l2.3-0.3l4.1-3.2l0.3-4.3l4.3,1.2l2,2.3l5.2,0.1l2.8-2.3l1.6-5.7l4-2.1l1.3-2.2l-2.2-3.5l0.5-3.3l2.3-5.4l-0.5-3.3l-3.2-4.8l0.7-1.7l-0.2-5.6l3.9-7.2l2.8-1.3l0.2-2.1l-2.2-3.4l-1.6-3.7l-3.3-0.8l0.8-3l2.1-1.2l-0.3-3.8l-2.3-0.8l-0.5-2.3l-3.5-6.2l-3.9,0.1l-5.2,0.8l-4.6-0.4l-2.6-1.3l-5.4,0.6l-2.2,1.1l-0.3-1.2l0.6-2.2l-1.6-2.3l-1.3-2.2",
    HI: "M260.3,565.3l-1.8,-3.5l-0.6,-3.5l3.2,0.4l2.3,2.6l1.1,2.5l-1.6,2.2l-2.6,-0.7zM270.3,572.5l5.1,2.6l2.1,-1.1l0.3,-2.8l-1.9,-3.5l-4.7,-0.5l-1.3,1.7l0.4,3.6zM281.8,577l1.6,4.3l3,-0.3l1,-0.8l2.2,1.6l3.5,0.1l-0.4,-2.5l-3.5,-2.1l-1.7,-1.9l-2.2,0.3l-1.7,-1.5l-1.8,2.8zM296.7,582l-0.6,2l1.8,2.8l2.8,0.1l4.7,-2.5l-0.1,-1.1l-3.2,-2.3l-5.4,1zM305.5,590.1l1.9,3.7l4.1,1.1l2.3,0.1l2.5,-1.6l5.8,-1.7l-0.7,-2.4l-5,-0.8l-3.8,1.1l-2.9,-1.3l-4.2,1.8zM323.7,589.1l1.3,3.2l5.2,0l6.2,2.1l3.1,-0.1l0.8,-1.3l-4.2,-3.1l-6.3,0.2l-3.2,-2.3l-2.9,1.3zM332.3,597.2l-1.7,1.2l3.2,3.8l7.1,3l7.4,0.7l6.3,-0.4l5.2,-1.5l-0.7,-2.7l-5.6,0.7l-5.4,-0.6l-4.3,-2.3l-6.3,-1.5l-5.2,-0.4z",
    ID: "M175.5,222.3l3.3-18.3l4.3-21.1l2.2-4.3l1.9-3l-1.3-3.2l2.2-5.3l3.2-3.1l0.7-2.3l0-3.5l1.3-2.8l-0.8-1.2l-3.2,0.3l-1.7-3l-0.3-3.2l-3.3-6.6l-3.4-3.3l-2.3-1.1l-5.2,6.7l-1.5,4.7l0.3,3.5l-3.9,4.4l-3.1,1.3l-0.3,0.5l-4,0.8l-3.3,4.1l-0.7,0.6l0.1,3.7l-7.9,18.1l-0.4,3.1l2.2,4.7l-3.1,7.2l-4.1,2.6l1.4,4.3l4.2,2.2l2.2,4.3l1.3,4.4l-0.2,2.2l3.7,4l2.1-0.3l1.9,2.7l-0.3,2.2l1.2,3l-0.5,2.3l13.2,2.8",
    IL: "M593.5,263.6l-1.5-2.5l-1.3-4.5l0.5-3l2.5-2.6l0-4l-2.5-4.6l-1.3-3.7l0.3-6.1l2.2-5.1l5.4-6.2l4.5-3l-0.3-4.2l-2.3-1.3l-3.5-3.2l-4.3-7.7l-0.1-6.2l4.2-1.6l2.5-3.3l0.1-2.5l-2.1-1.1l-2.1-2.3l3.3-5.2l7.2,2.9l6.7,1.3l6.3,0.3l-0.3,3.1l2.3,2.1l3.5,0.5l1.9,2.2l-0.7,4.3l-1.2,2.6l0.3,3.3l2.2,3.2l-0.2,2.3l-0.2,2.5l3.3,6.7l9.2,7.3l0.5,3.2l-2.2,0.1l-2.3,2.2l-0.1,5l-2.3,3.7l-0.4,4.1l1.8,2.2l0.2,2.3l-2,3.2l-0.8,5l-4,4.2l-2.7,5.5l-0.3,3.5l-1.2,1.9l-0.2,2.2l2.2,4.7l5.3,6.3l4,3.5l0,2.2l-0.9,2.2l-8.4,3.5l-2.2-0.5l-3.2,2.5l-1.9,3.3l-3.5,0.2l-1.8-3.3l-1.2-0.3l-3.5,1.6l-5.6-3.7l-3.8,0.2l-0.5-2.7l-2.2-3.9l-1.1-3.2l1.3-2.7l-0.3-4l-3.4-6.4l-2.2-2.2l0.3-3.3l2.8-1.9l3.3-3.7l-0.5-3l-2.5-3.8l-0.5-3.1l-1.2-3.2",
    IN: "M647,282.6l-1.3-15l-2.2-20.3l-1-10.1l2.3-1.1l3.7-3.2l5.1-0.4l1.2-2.2l4.1-3.5l0.3,3.7l2.3,2.5l5.2,4.3l0.3,4.8l3.3,2.1l-1.3,3.5l-0.1,3.1l-3,4.5l-4.2,1.5l-2.3,2.4l0.3,7.2l-2.3,3.7l0.6,2.2l-0.3,5.4l-1.3,5.3l1.2,3.5l-0.3,4.5l-3.2,4.3l-2.8,1.5l-2.2-3.3l-3.6,2.3l-0.3-3.7l0.6-4.2l-0.3-5.3l1.5-5.7l0.5-5.3",
    IA: "M504.3,213.2l2.3-5.3l5.7-6.2l2.1-6.5l0.2-5.7l-2.7-4.3l0-6.6l-1.3-7.3l-0.6-5.2l0.3-3.3l-3.7-4.7l-4.2-2.9l-0.4-3l2.2-4.7l-2.2-2.1l49.4-1.1l44.7-2.2l2.5,3.2l-0.3,6.7l2.3,4.3l6.2,6.3l4.3,1.2l0.6,2.5l-6.6,4.5l-3.3,4.7l-0.1,5.5l-2.2,2l-3,1.3l-3.6,6.1l-0.1,3.2l-2.8,0.2l-2.5,3.9l0.3,2.9l-3.1,1.5l-3.3-1.5l-5.3-0.7l-13.1,2.2l-5.2,2.3l-4.3-0.3l-3.3-3l-7.3,0.2l-3.8,1.3l-4.3-3l-0.7-4.2l-4.3-0.4l-3.3,2.3",
    KS: "M422.7,329.3l0-1.3l-26.3-0.3l-27.4-0.7l-32.3-1.3l-3.5-0.2l3.5-28.3l1.7-18.7l18.2,0.7l28.3,0.7l37.3,0.3l29.3-0.3l5.3,7.2l1.1,4.3l3.7,5.8l2.5,3.5l1.2,2l-0.8,4.3l-4.2-0.2l-4.2,1.5l0,4.1l-0.7,4.5l-0.6,3.5l-30.3,0.3",
    KY: "M695,326.2l-3.5,4l-7.2,5.3l-2.2-0.2l-1.6,3l-5.3,3.5l-3.5,0.5l-1.2,3.4l-7,0.5l-4.5,2.5l-1.3,3.5l-6.5,0.5l-5.3,5.3l-3.7,0.5l-3.5-2.2l-5.6,3.5l-2.5,3.5l-4.2,0.2l-3.3,1.5l-2.3,1.5l-3-0.5l-5.5,4.5l-5.5,0.5l-2.9-3.5l-2.3,0l-2.8-3.5l4-3.5l2.5-2.5l-2-3.5l0.2-2.1l12.2-1.4l30.3-3.3l10.7-1.5l1.7-4.5l4.2-2.3l4.5,1.7l4.5-1.8l1.2-3.5l4.1,0.3l7.2-3.5l4-0.5l-0.4,3.2l3.2,1.2l3.5-0.5l4.3-4.5l2-4.5l4.1-1.3l1.8-1.5",
    LA: "M581.5,485.3l-0.7-7.2l-3.7-2.2l-0.9-4.7l-2.9-4.3l0.1-5.3l13.2-0.8l14.5-1.2l-0.3-10.5l19.3-1.9l1.3,4.2l4.3,7.3l5.4,5.9l7.2,2.5l-3.5,5.1l1.2,2.3l-0.1,2.7l-2.7,3.2l-4.3,1.8l0.5,2.7l4.4,2.4l-0.3,5.3l-1.1,5.1l-3.5,5.3l1.3,2.7l-2.3,1.2l-1.3-2l-3.9-0.8l-3.2,3.5l0.5,2.1l2.2,1.1l-0.4,2.2l-2.2,2.3l-5.3-0.3l-6.3-3l-3.5-0.5l0.3-4.6l-3.3-0.5l-0.5,4.8l-1.5,0.2l-0.6-3.9l1.3-5.1l2.3-3.1l0.2-3.5l-1.3-0.8l-6.2,1.3l-3.2-1.1l-2.5,3.5l-2.3-2.1l4.3-2.7l0.4-3.7l-1.3-1.7l-4.5,2l-3.3-0.3l-1.3-1.7l-0.3-5.4l-3.5-2.5",
    ME: "M878.5,92.7l2.2-3.2l2.7-1.5l1.9,2.3l2.6,0.7l3-2.7l4.5-7.5l-1.5-2.2l-3.2,0.2l-1.2,2l-4-2.3l-0.5,2.1l1.2,2.7l-3.5,2.7l-1.7-0.3l-0.7-2.7l0.2-5.3l-1.3-6.9l3-0.3l1.3-3.8l-2.3-6.1l-2.2-1.7l-2.5,0.7l-0.3,2.1l1.5,3.3l-2.3,1.8l-0.5-3.5l-2.4,0.5l-0.2-3.5l-2.3-3l-1.7,1.1l0.2,4.1l-1.2,0.7l-0.5-5.2l-0.7-3.3l-2.1,0.3l-1.4,4.2l-1,0.2l-3.3-3.2l-3.8,3.5l0.7,5.2l-0.5,5.3l-2.2,3.5l0.3,2.2l-0.2,2.1l-2.9,3.9l-5.3,4.8l-0.5,3.2l0.5,2l-0.8,2.8l-3.3,3.2l-2.2,4.5l0.3,2.7l2.8,0.2l2.1-1l0.2-5.2l0.7-1.7l1.2,1.8l-0.5,5.3l-0.7,6.2l-1,3.5l-3.1,4l0.5,7.3l4.2,2.3l1.3-0.3l2.5-3.7l1.3,0.7l-2.3,5.3l-0.3,3.3l-1.5,1.5l-1.2,0.3l-2.3-3.3l-4.3-0.5l-1.6-3.7l-2.2-1.4l-0.5-5.3l3.5-2.8l-0.7-3l-5.1-8.5l-2.3-5.7l2.7-2.5l3.1-0.5l0.3-3.6l-4.2-3.2l-3.3-0.8l-2.3,2.2l-2.4-3.7l2.3-2.7l2.2-6.6l5.4-8.4l3.2-2.3l4.7,3.9l4.5,0.7l0.8-1.6l-0.3-3.6l5.3-4.2l1.4-3.3l2.5-0.5l4.3,5l5.3,11.3l3.3,3.2l2.2,0.3l0.2-1.7",
    MD: "M824.2,280.2l-3.1-1l-1.7,0l-3.2-3.7l-5.2-3.5l-2.3-0.5l-2.2,0.4l-2.4-1.2l-4.2-0.5l-0.4-4.2l2.8-2.4l1.9-2.7l-3.7,0.3l-5.3,0.7l-5.3-0.3l-2.7,1.7l-2.3-0.3l0.2-2.1l-3.6,3.5l0.2,2l-4.5,0.7l-5.3-2.3l-3.3,3l-0.4-5.1l3.7-2.7l1.3-5.1l3.1-3.3l2.2,0.3l6.8-2.5l2.3-3.2l2.3,0.7l7.3-0.5l8-2.2l2.5-3.6l3.1-2.3l0.7,5l10.2,2l-0.9,3.5l4.7,1.5l3.2-0.2l5.3,2.1l3.7,0.5l2.5-0.4l1.3,3.3l-2.7,1.2l-1.3,4l3.3,2.2l2.5,1.2l-0.2,2.2l-0.3,1.6l-1.1,0.1l-2.5-0.2l-3.6,2.3l-1.1-1.4l-2.3,2.8l1.4,2.2l-1.2,1.6l-3.2,0.5l-5.2-1.2l-4.3,3.5",
    MA: "M880,179.7l-2.1-4.7l-3.3-1l-0.5-2l4.9-1.4l1,2.3l2.2,0.3l0,0l-0.2,1.2l-0.2,3.3l-1.8,2zM862,186.2l6.8-2.2l2.5,2.2l3.3-0.2l1.5-2.7l3.3,3.1l-1.3,2.7l-4.1,1l-3,0.2l-2.3-2.3l-3.7,0.4l-3-2.2zM842.3,175l9.7-2.3l4.2-3.3l5.4-1.6l3.5,4.1l-3.1,3.2l5.3,0.1l5.2-3.5l1.3,3.3l-0.3,2.7l-6.7,2.5l-8.8,1.2l-7,0.6l-1.3-1.3l-3.5,0.6l-2.3-2.3l-1.2-0.5l-2,2.5l-3.3,0.1l-1.3-3.3",
    MI: "M612.8,173.8l6.3-7.1l4.2-3.3l5.8-7.1l1.5,0.5l2.5-3l-0.5-6.5l-2-3.7l-3-3l-3.5-1.4l-1.5-3l1.5-2.5l3.3-1.5l1.5-4.5l0-5l-3.3-1l-3.3,0.3l-5.5,2l-2.2,4.8l-0.2,3.3l-5.4,1.2l-2.3-1.3l-1.3,0.3l-0.3,1l1.9,7l-2.4,2.2l-0.3,1.7l5.3,3.5l1.5,3.5l-1.2,4.3l-1.5,2.5l-4.2,3.5l-2.5-0.5l-2-1.5l-1.5,2l-5.8,3l-5.5-1.5l-1.5-1.2l-2.7-0.3l-3.2-2.3l-5.6-0.1l0-4l-6.6-9.5l-4.2-2.8l-3.5-0.5l-5.2-3.5l-0.1-4.3l0.8-2.2l3.1-1.5l0.5-4.2l1.7-3.5l-0.2-3.5l0.7-3.5l-3-4.7l-0.2-5l2.5-2.5l1.5-5l-1.3-3l1.8-2.5l-0.5-4.5l-3.1-6.5l5.3,0.3l18.5-3l3.5-0.3l0.3,2.4l5.3,3.5l3.2-0.1l2.8,1.1l-2.4,4.8l-0.5,4.6l2.2,2l3.1-0.3l4.3-3l2.5,1l1.7,4.3l4.3,6.5l-1.5,3.1l-0.3,3.3l0.7,2.3l4.3,1.3l2,5.3l-1.3,2.7l-0.5,6.8l1.6,4.3l-0.3,3.5l-3.5,5.5",
    MN: "M440.2,119.5l-0.3-10.2l-2.4-6.3l-1.8-10.8l-1.3-9.5l-2.5-4.5l-1-6.3l-0.5-10.4l-0.1-3.5l24.3-0.5l0.3-8.3l0-4.3l-2.3-1.3l-3.2-0.3l-0.7-6.5l4.2-0.3l0-5.2l2.9,0l0.1-5.6l14.3,0.1l0.5,2.3l6.1,0.1l0.2-2.2l17.4,0l0.2,3.2l3.2,5.3l3.7,2.6l0.3,6.7l3.3,3.2l0.3,3.2l-2.7,5l-5.8,3.8l-6.3,7l-2.3,4.8l-0.4,7.7l-1,2.7l-7.5,6.2l-1.5,3l0,6.5l-2.5,0.8l-4,3.8l-3.7,8.7l-4.4,0.2l-11.3,0.7l-5.6,0l0,4.3l-9.3,0.5",
    MS: "M622.2,483.8l-10.4,1.4l1-3.5l-1.2-2.7l1.4-4.2l5.4-2l-0.3,6.1l5.3,3.7l-1.2,1.2zM580.8,415.4l-2.3-2.3l25.4-1.5l22.1-1.6l1.6,22.1l-0.3,4.1l3.2,0.7l1,3.7l-2.3,4.7l-2.1,7.1l0.2,2.6l-2.6,1l-4.4-0.9l-0.7-4.1l-2.3-3.2l-0.5-6.3l-4.4-3.1l-0.7-5.2l-3.2-2.5l-3.3-0.3l-2.3,3.3l-3.3-0.3l-0.7-2.2l1.2-6.1l-2-5.3l-2.7-1.5l0.2-1.3l-2-5l-4.3-0.8l-1.5,2.3l-4.8,0.3l-0.3,5.7l-1.3,7.6l2.3,4.2l2.1,2.5l-0.3,7.3l-1.5,5.3l0.5,3.3l2.5,5.3l-1.5,2.5l0.7,7.2l-5,0.5l-14.3,1l-13.5,0.8l0.9,4.7l3.7,2.2",
    MO: "M510.8,310.7l-0.3-3.2l46.2-2l22.2-1.5l6.3-0.5l2.2,2.5l4.5,7l4,3.2l0.7,2.5l-8.8,3.5l-2.2-0.5l-3.2,2.5l-2.3,3.2l-3.5,0.5l-2-3.3l-1.2-0.3l-3.2,1.5l-5.7-3.5l-4.2,0.2l-0.3-2.5l-2.5-4.2l-1.5-3.3l1.5-2.7l-0.3-4.7l-3.5-6.2l-2.2-2.2l0.3-3.3l2.8-1.7l3.5-3.7l-0.5-3l-2.5-3.7l-0.5-3l-1.2-3.3l-1.2-2.3l-2.2-0.2l-4.7,2l-2,1l-5.3-3.5l-3,0.2l-4.3,3.3l-3.4,0.5l-0.6,1.5l0.6,3l-0.5,2l-4.5-2l-4.5,0l-2,1.5l-6-1.3l0.2,3.3l1.5,2.3l3,4.5l3,3l2,4.6l0.5,3.3l-0.2,2.7l-2.3,2.5l-0.8,3.5l0.5,3.7l4.3,3.7l2.5,3l0.5,2.5l-0.8,3.5",
    MT: "M336.5,114.5l-0.3-14.2l1.2-21.4l0.7-18.5l0.5-10.7l-36.2-3.1l-38.5-5l-19.5-3.3l-19.4-3.6l-16.2-3.4l-4.3,24.2l2.2,5.3l-0.6,3.8l2.3,7.2l3.7,3.7l2.5,6.5l2,2.5l-0.2,4.6l-3.2,2.8l0.7,5.5l2.5,1.5l2.5,2l-0.2,3.3l0.5,3.9l7,7.8l3.7,1.3l3.2,4.3l-0.3,5.1l0.7,3l-1.7,0l-3.3,4.3l-0.5,3l1.5,1.5l36.3,4.3l35.3,3.3l31.5,2.3",
    NE: "M359.2,244.8l-38.2-2.3l-27.3-2.3l-18.2-1.8l2.3-24.5l1.3-10.3l21.7,1.5l30.4,1.6l34.2,1.2l35.2,0.5l2.5,2.8l-0.2,2.7l3.2,5.2l5.7,7.5l6.2,2.7l3.5,0.7l4.5,2l4.5,0l4.7-1.5l1.3,3.5l-0.3,4.2l0.3,2.3l-0.5,5l-2.3,3.5l-1.3,5.5l-0.5,3.3l-1.5,0.3l-6.5-0.3l-27.2-0.7l-27.5-1.2l-4.2-0.3l1.2-7.5l-1.2-7",
    NV: "M138,301.5l15.2,2.5l9.7,1.3l-4.2,20.5l-3.2,14.1l-3.6,16.3l-1.5,9.3l-1.3,4l-0.3,4l4.3,0l2.2,2.3l3.5-0.3l5.2,4.3l2.5,0.3l-22.5-33l-3.2-5l-1.3-4.8l1.2-3.5l0.3-7.1l-3-6.3l-1.4-6.9l2.1-11.5",
    NH: "M861.3,132.2l-0.3-3.5l-2.5-0.5l-1.3-4l-4.7-2l0.7-3.4l-2.2-2.5l0-2.3l-3.5-2.3l3.7-5.1l-0.3-4.3l-2.5-1.5l1.3-3.5l-1.2-5.3l-3.3-3.5l-0.5-2l2.3-3.7l-0.7-6.5l0.7-3.3l-0.5-3l-1.5-0.3l0.5-11.8l1.7-3.8l-0.7-4l3.3-2.7l4.5,5.2l5.1,11l3.4,3.3l2.2,0.4l0.3-1.7l-2.7-4.3l1.1-3.7l-0.5-5.1l2.6-0.5l0.7,6.5l-1.5,6.5l-0.5,7l2.3,3.5l0,3.7l-4.2,5.5l-5.8,5l-0.5,4.7l0.5,5.5l-1,3.2l0.3,3.7l0.5,4.5l-0.5,5.7l2.2,2l0.5,4.5l-2.2,2.2",
    NJ: "M830,235.8l-1.6-2l-3.8,2.8l-1,3.7l-0.3,3.2l2.5,3.7l2.8,2.2l-0.5,5.2l-2.4,0.6l-1.3,3.5l-1.5,2l0.2,2.3l4.2,3.1l3,0.1l2.3-3.2l0.5-3.2l-1.3-3.2l0-3.4l1.3-0.8l-0.5-3.7l-0.8-5.2l-2.5-4.5l0.3-2.1zM830,225.3l1.5-2.5l1.3-4.8l-1-1l-2,4l-1.3,1.2l0.2,3.8l1.3-0.7z",
    NM: "M214.3,441.2l6.5-71.1l-17.8-2.3l-20.5-3.1l-0.7,5.1l-0.7,4l-3.1,5.2l0.1,5.1l-1.3,3.2l0.2,1.3l3.5,4.2l1.3,3l2,4.5l1.1,1.8l-0.5,0.7l-0.3,2.4l-3.1,3.5l-1.4,4l2.1,1.2l13.6,8l0.8,2.8l2.1,0.6l0.5,2.3l23.9,3.6l0,0l-0.3,3.3l-5.1,0.2l-1.5,11.1l-0.3,3.3l17.3,2l20.1,1.7l-1,6.4l6.2,0.6l2.3-21.3l-25.7-3.3l-19.1-3.3l1.2-6.7",
    NY: "M829.6,175.1l2.2-1.5l5.3-3.2l4.5-1.6l6.5-0.7l4.2,3.8l2.2,4.3l5.2,3.2l2.3-0.4l2.3-2.5l-2-7.1l0.5-3.3l-3.3-3.5l-1.5,0.5l-2-1l-6.3-8.3l2.1-1.7l6.5,2.4l5.3,1.5l4.2-0.2l10.3-4.2l3.2-3.5l3.5-5.5l2.5-4l0.5-4.8l-0.3-5.5l-3-6l-3.7-3.5l-2.5-0.2l-6.5,3.5l-7.5,2l-10.3,2l-5.1,0.3l-2.5-2.5l-4.3,0.2l-3.3,3l-3.3-0.2l-1.2,0.2l-3.5-3.5l-10.2,4.5l-3.3,0.3l-4.7-2.7l-6.2,2.7l-7.3,1.7l-1.7,2.5l-0.7,4.2l0.2,3.7l-2.5,2.5l-2.2,0.5l-2.5,3.5l-3.7,2.7l-4.3,2.5l-4.5,0.5l-1.8-2.2l-2.8,0.2l-3.6,3.8l-4.2,0.2l-1.3-1.5l0.2-3.5l3.7-3.3l1-4.3l-0.7-2.8l-0.8-3.5l3-3.7l0.3-3.3l-17.3,3.3l-22,4.5l-3.3,0.3l-0.5,3.5l-3.2,3.5l5.2,20.2l2.3,3.2l3.2-0.3l1.5,4l-2.5,4.2l0,4.2l-0.7,1l0.3,2.5l4.7,3.2l7.2-3l4.5-2l3.8-0.3l3.2,1.5l3.7,0.5l6-3.5l1.5-3.3l3.5,1.5l0.8,5.5l-2.2,4.5l-0.3,3.5",
    NC: "M826.3,358l-3.3,2.2l-7.3,5.3l-3.5,5.5l-1.1,4.4l-2.6,2l-3.2-0.5l-0.7,5.7l-2.6,5.5l-3.2,2.3l-2.3-0.3l-0.6-1.3l-3.9,0.3l-6,3.5l-4.8,5.3l-2.3,0.5l-2,2.2l-2.5,5.3l-6,3.5l-2.2-0.7l-0.2-3.5l-1,3.2l-4,0.5l-4.3,2.3l-3.2,3.2l-3.5,0.5l-3-1.8l-5.8,1l-8.8,1.3l-22.6,2.1l-18.8,1l-7.2,0.5l-1.2-4l-3.9-0.3l-2.2,0.7l0.5,2.5l-4.7-0.3l3.2-3l5.3-3.2l3.3-1l4.2-6.8l5.2-2.5l4.5-0.3l2.7-2.2l6.5-1l6.3-0.3l1.5-2.3l4.5-2l1.5-0.8l2.2-4.2l5.7-3.2l5.3-5.6l3.7-0.7l4.5,0.5l3.3-2.8l1,2.3l7.3-2.7l2.5-0.3l1.3,2.7l3.5,0.6l3.5-3.5l4.5-1.2l2.3-3.7l3.4,1l5.5-4l3.5,2.2l2.7-4.5l2.7,1.5l4.3-2.5l3-3.5l3.4,0.3l3-3.2l3.2-1.5l2.7,0.3l2,3.5",
    ND: "M440.7,119.5l-0.2-15.5l-2.5-6.3l-1.7-10.7l-1.2-9.3l-2.5-4.5l-0.8-6.3l-0.7-10.2l3.4-0.2l26.5-0.3l25.3-1l25.7-1.5l1,5.5l2.5,4.3l4.3,6.2l1.8,4.1l0.4,5.5l2.5,4.5l2.5,9.2l1.3,3.2l-0.5,3.3l0.7,5.5l1.5,2l-0.5,3l-49.5,1.3l-37.7,1.7",
    OH: "M690,262.7l2-4.8l3-1l2.3-3.5l4.5-3.2l3.1-1.5l3.5,2.3l8.2,3.5l5.2,4.2l5.3,2.3l5.3,4.3l4.2,1.3l2.7,2.3l-0.3,3.2l-2.3,3.7l0.5,3.3l-2.2,5l1.3,2.5l-3.2,2.3l-3.3,3.5l-2.5,4.3l-3.8,2.4l-1.8,4.3l-4.5,2.3l-3.2,4.5l-4.5,3l-2.3-3l-3.6,2.3l-4.2,2.5l-6.3,0.5l-1.7,4.5l-10.5,1.2l-3.3-25.1l-1.8-18.6l2.2-1.8l2.7-5.3l4.5-4.3l2.5-4.3l-0.5-3.5l-1-3.3l1.3-2.2",
    OK: "M332.8,385l0.3-8.3l0.5-4.8l-2.3-3.3l-1.5-1.3l1.2-4.3l-3.5-0.5l-2-4.5l2.5-0.5l1.5-7.5l-3.3-4.5l-0.3-5l3.3-0.2l25.7,0.7l27.2,0.3l0.3,7.1l28.5,0.5l29-0.2l5.3,7.5l1.2,4.3l3.5,5.5l2.5,3.5l1.3,2l-0.8,4.3l-4.3-0.2l-4.3,1.5l-0.2,4.3l-0.5,4.7l-0.7,3.7l1.3,2l2.5,0.3l1.5,4.5l3.8,2.8l3.5,1.5l3.5,0l0.3,3.3l-3.7,2.8l-1,4.5l1,2.5l-4.3,0.2l-7.5,0.5l-29.3,1.5l-22,0.5l0.2-7.1l-3.2-3.2l-3.7-3l-3.5-1.7l-3.8,1.7l-4.1-3.7l-0.3-3.3l-5.5,2.2l-3.3-1l-3.3-4l-4.2-2.5l-1.7-0.3l-3.2,2l-3.5-2.7l-2.2-3.8l-5.4-0.6l-2-3.5l-6.3-0.3l-2.3-1.5l-3.7-0.5l-1.3-2.5",
    OR: "M87.7,157.7l-4.7-1.3l-4-3.3l-3-3.2l-0.7-4.8l-5-3.3l-2.3-5.2l2.7-3.5l1-5.5l-0.3-3.5l-3.8-5.5l3-2.3l1.5-3.3l1.3-1.5l3.3-4.5l3.3-1.3l0-3.8l5.2-7.8l5.3-1.5l2.5-0.5l0.3,3.7l1.5,3.5l3.5,2.7l-1.3,6.2l-1.5,3.2l-0.5,6.5l2,3l4.5,2l1.3,3.5l4.2,1.5l4.7,-0.8l2.2-1.3l6,1l4.5,0.5l3.3,-3l6.3,-1.5l1.7,1l5.8,-2.3l3.2,0.5l5.4,3.5l5,1.5l-3.3,18.3l-13.2-2.7l0.5-2.3l-1.2-3l0.3-2.2l-1.9-2.7l-2.1,0.3l-3.7-4l0.2-2.2l-1.3-4.4l-2.2-4.3l-4.2-2.2l-1.4-4.3l4.1-2.6l3.1-7.2l-2.2-4.7l0.4-3.1l-5.5-0.3l-5.5,0.3l-9.5,1.3l-11.5,1.8l-16.5,2.5l-7.2,0.7l5.5,17.5l-0.3,5.2l2.5,3.5l1.3,5l3.5,3.5l-1,5.5",
    PA: "M789.6,243l-5.7,2.5l-4.5,1.2l-8.5,3l-25.8,6l-14.5,2.3l-2.5,0.5l-5.5-2l-3.5,0.2l0.3-3.2l1.2-4.5l2.5-4.3l1.5,1l3,0l0.5-1.5l-1.5-2l-2.5-6.5l-5.5-20l3.7-3.5l0.5-3.2l17.3-3.5l21.5-4.5l3.7-0.3l2.8-3l3.3,0.2l3.2-2.7l4.3-0.3l2.5,2.3l5.4-0.3l10.4-4l3.7,4l1.2-0.2l3.3-3l4.3-0.2l2.5,2.5l-2.5,4.2l-3.3,6l-0.5,4.5l-0.3,2.5l3,4l1,3.5l4.2,3.5l2.7,5.3l-0.5,1.2l-5.3,3.3l-4.2,0.5l-3.3,3.7l-1.1-1l0.5-3.7l-2.3-1l-4.5,3.2l-1.2,2.3",
    RI: "M862.8,186.3l-1-5.5l-1.3-2.3l2.5-1.2l2.3,3.6l2.2,3.2l-1.7,1.3l-2.3,1.8l-0.7-0.9z",
    SC: "M736.1,396.3l-3.2-3.2l-2.3-4.5l-4.3-4l-2.3,0.5l-2.7,3.5l-3.3-0.7l-3.7-5.2l-4.8-2l-4.2-0.2l-1.2,1.3l-3.7-0.3l-1.8-2.3l-7.2,3.5l-9.3,5l3,3.3l-2,5.5l-3.3,0.5l-0.5,4.5l-3.5,2.8l-0.7,2.3l4.2,1l2.5,2.8l5.3,2l4.7-1.3l6.3-3.7l1.7,1.3l3.5-0.5l3.3-3.2l4.2-2.3l3.8-0.5l1,3.2l6.1-2.2l4.3-0.3l1.5-2.3l3.5-1.2l3.3,1.5l5-5.2l3.5-2.3l0.8-3",
    SD: "M388.5,196l-1.3-7.1l-1-7.7l1.7-6.5l-0.5-3l-4.3-5.3l-0.2-5.7l36.2,1.5l35.5,0.3l26.1-0.5l2.2-4.7l-2.2-2.1l1.2,0.1l49.3-1.1l0.5,6l1.3,7.2l0,6.6l2.7,4.3l-0.2,5.7l-2.1,6.5l-5.7,6.2l-2.3,5.3l-0.3,4.5l-3.3-2.3l-4.3,0.4l-0.7,4.2l-4.3,3l-3.7-1.3l-7.3,-0.2l-3.3,3l-4.3,0.3l-5.2-2.3l-13.1,2.2l-5.3,0.7l-3.3,1.5l-3.1-1.5l-2.7,0l-0.1-3l-2.5-4l-3.5-0.5l-4.8,0.2l-3.5-0.2l-6.2-2.7l-5.7-7.2l-3.2-5l0.2-2.7l-2.5-3l-34-1l-14.3-0.7",
    TN: "M660.8,381.5l-14.6,1.7l-20.1,1.6l-11.2,1.6l-3.9,0.3l-4.3-0.3l-22.2,2l-5.7,0.5l-0.2-3.5l-2.8,0.7l-2.5,3.6l-4.3,0l-3.3,1.5l-2.3,1.5l-3-0.5l-5.5,4.5l-5.5,0.5l-2.8-3.5l-2.3,0l-2.8-3.5l3.5-2.7l2.2-4.3l5.3-4.3l-0.5-2.2l2.5-2.2l12.5-1.5l30.5-3.3l11.5-1.5l0.8-4.7l4.2-2.2l4.5,1.7l4.5-2l1.2-3.5l4-0.2l7.5-3.5l4-0.5l-0.3,3.5l3,1.2l3.5-0.5l4.3-4.5l2-4.5l4.5-1.3l1.2-1.5l3.5,4l7.3-5.3l-0.5,3.5l1.3,2.7l-2.3,3.3l-0.5,2.3l1,2.2l-1.7,5.5l-4.5,3.5l-0.3,2.2l-2.2,4.5l-3.7,2.5l-4.5,2.3l-4.8,0.5",
    TX: "M334.2,415.2l26.5-1.2l2.5,21.5l3,28l1.3,8.3l3.8,16.3l2.2,3.8l0.3,4.1l-2.3,5.3l-4.3,5l-2,0.5l-2.5-0.5l-3.5,2.5l-3.2,3.2l-1.1,4.2l-0.2,7l-3.4,3l-3.2,0.5l-4.3,3.5l-2.3,0.5l-1.2-2.5l-6.3,3l-1.5,2l0.5,2.5l-3.6,5.5l-1.3,5.3l0,2.5l3.2,3.2l1.5,7.5l1.7,5.3l-0.5,5.5l0.5,2.7l1.8,0.7l2.2,6.5l-3.5,0.3l-7.3,2.5l-3.5,3.3l-1.3,4.8l-0.5,5.7l-4.5,2l-6.5-4.5l-5,0.3l-3.5,0.5l-3-1l-3.7-4.2l-4.5-0.3l-3.3-4.3l-5.7,1.3l-3.5-2.7l-1.5-3.5l-4-3.7l-2.5-3.5l-0.5-5.7l-2.8-3l-3.5,0.5l-4.5-1.5l-5-3.3l-2.5-4.3l-0.3-3.5l-3.3-5.5l0.5-3.5l-2.5-2.7l0.3-3.5l-2.5-3.3l-2.7-0.5l-6.5-5.5l-0.3-7.2l-2.5-3.7l0.5-10.5l-0.5-4.3l2-5.5l3-1.5l5.8-0.3l1.5-1.8l-0.2-3.5l7.3-4l5.5-0.5l3.2-5.5l0.5-5l1.5-2.5l-0.7-2.8l4.7-11.5l1.7-1l0.6-6.7l1.3-6.7l3-4.2l0.7-3.5l3.5-4.7l2.5,1.5l6.3,0.3l2,3.3l5.3,0.5l2.2,3.8l3.5,2.7l3.3-2l1.7,0.3l4.3,2.5l3.3,4l3.3,1l5.5-2.2l0.3,3.3l4.1,3.7l3.8-1.7l3.5,1.7l3.7,3l3.2,3.2l-0.2,7.2l3.1,3.1l0.3,3.6l4.1,2.8l-2.5,4.1l0,4.5l-2.2,4l2.3,3.3l-0.2,5",
    UT: "M191,303.5l-16-1.8l-19.5-2.7l-2.9,0.2l-0.8,5.1l2.2,4.7l0.8,5.3l-1.6,4.2l3.8,5.1l2,5.6l-1.3,2.2l-0.4,2.3l2.3,2.3l6.2,0.7l2.1-2.2l3.3-0.3l4.5,1.5l-0.1,9l-0.5,3.3l-0.1,7.5l20.5,3.1l17.8,2.3l2.3-17l2.5-16.3l-25.7-3.5l1.5-15.5l-0.5-4.3",
    VT: "M839.3,138.7l-1-3.7l2.2-7.3l-1.7-2.5l-0.8-5.7l3.4-6.2l-0.7-5.4l-1.3-5.7l-2.5-2.1l1.4-3.5l-0.7-3.5l2.2-4.5l-0.4-3.5l-0.7-5.5l18.7-4.2l-0.5,3l-0.7,3.3l0.7,6.5l-2.3,3.7l0.5,2l3.3,3.5l1.2,5.3l-1.3,3.5l2.5,1.5l0.3,4.3l-3.7,5.1l3.5,2.3l0,2.3l2.2,2.5l-0.7,3.4l4.7,2l1.3,4l2.5,0.5l0.3,3.5l-5.8,1.8l-22,5.5",
    VA: "M784.3,295.3l-2.5-1.7l-0.3-3.5l0.3-2.5l-4.3-3.5l2.7-6.5l2.3-2.5l-2.2-1l-1.1-3l-6.2-3.5l-2.3,3.5l-6.5,2.5l-2.3-0.5l-3.5,3.5l-1.5,4.7l-5.3,0.7l-4.3-4.5l-13.3,1.5l0.3,3l-4.1,0l-3.3,3.2l-3.3,5.5l1.3,4.5l-6.5-0.5l-4.3,0.5l-1.8,3.7l-3.3-0.5l-2.5-1.7l-3.2,0.5l-4.3-2l-2.3,0.3l-3.3,6l-7.5,5.3l-3.5-4l-6.8,0.7l5.2-2.3l2.7-2.3l6.5-1l6.3-0.3l1.5-2.3l4.5-2l1.5-0.8l2.2-4.3l5.7-3.2l5.3-5.5l3.7-0.7l4.5,0.5l3.3-2.7l1,2.5l7.3-3l2.5-0.3l1.3,2.7l3.5,0.5l3.5-3.5l4.5-1.2l2.5-3.5l3.3,1l5.5-4l3.5,2.2l2.7-4.5l2.7,1.7l4.3-2.5l3-3.5l3.5,0.3l3-3.2l3.2-1.5l2.5,0.5l0.3,4.2l4.2,0.5l2.3,1l2.3-0.5l2.2,0.5l5.3-0.7l3.7-0.3l-1.9,2.7l-2.8,2.4l1.2,4.7l-1.7,5l-3.2,7.5l0.5,2.3l-1.2,5.2l-2.5,0.3l-5,3.3l-0.3,2.5l-2.5,0.7l-3.3,3.5",
    WA: "M100.6,68.6l0.8-3l3.3-4l3-2.8l1.8-3.2l-1.3-1.2l-4.5,0l-2-4l-5.8-1.1l0.3-2l3.3-0.2l-0.3-3.2l-3.5-0.5l-2.7,0.7l-5.7-2.5l-2.3-2.5l2.3-8.5l3.8-5.7l-2.5-3.3l0.2-7.5l-3.5-4.3l-0.7-9.7l3.5-0.5l6,1.3l6.2,2.5l4.3,0.3l3.3,2.3l6.3,1.5l5.5,0.5l3.5,3.2l5.5,1.8l3.5,1.5l4.5,-0.2l4.8,0.5l2,3.5l1,5.3l-2.5,1.5l-0.5,5.5l-1.5,2.5l0.5,3.3l-6.3,1.5l-3.3,3l-4.5,-0.5l-6,-1l-2.2,1.3l-4.7,0.8l-4.2,-1.5l-1.3,-3.5l-4.5,-2l-2,-3l0.5,-6.5l1.5,-3.2l1.3,-6.2l-3.5,-2.7l-1.5,-3.5l-0.3,-3.7l-2.5,0.5l-5.3,1.5l-5.2,7.8l0,3.8l-3.3,1.3l-3.3,4.5l-1.3,1.5l-1.5,3.3l-3,2.3l3.8,5.5l0.3,3.5l-1,5.5l-2.7,3.5l2.3,5.2l5,3.3l0.7,4.8l3,3.2l4,3.3l4.7,1.3l1,2.3",
    WV: "M739.3,276l-0.2-3.5l-1.5-0.7l-2.2,2.5l-4.5,0.7l-3.5-3.5l-2.5-3.5l-1.2,2.2l-7.3,0.5l-2.3-0.7l-2.5,3.3l-6.5,2.5l-3.3-0.3l-2.3,3.5l1.3,4.5l-1.3,3.5l-5.3,0.5l-2.5-1.7l-2.5,0.3l-4.5-2.2l-2.3,0.3l-3.5,6.2l-7.3,5.3l-3.5-4l-4.3,0.7l2.3-3.3l0.5-2.3l-1.5-2.5l2-5.8l4.7-3.5l0.3-2.2l-2.5-4.7l-0.2-2.2l1.2-1.9l0.3-3.5l2.7-5.5l4-4.2l0.8-5l2-3.2l-0.2-2.3l-1.8-2.2l0.3-4.2l2.3-3.5l0.2-5l2.3-2.2l2.2-0.1l-0.5-3.2l3.2,1.8l5.2,4.2l5.3,2.5l5.5,4.3l4.2,1.5l2.5,2.3l-0.3,3.2l-2.5,3.5l0.5,3.3l-2.2,5.2l1.3,2.5l-3.2,2.3l-3.5,3.5l-2.5,4.3l-3.5,2.5l-1.8,4.5l-4.5,2.5l-3.5,4.5l-2.3-3l-3.7,2.3l-3.5,2.5l-6.3,0.5l-1.7,4.5l3,2.5l3.2,2.5",
    WI: "M520.2,161.3l3.2-2.3l4.8-7l4.2-3.3l2.5-5.8l-0.5-2.3l0.8-4.8l4.5-6.5l4.5-5.5l2.5-2.3l1-4.3l-1.5-3.5l0.3-2.3l4.5-3.5l1.5-5.5l-1.3-1.5l0-7l3.5-4.3l0.5-3l-2.3-3l-0.5-4.5l1-2l3.5,2l3.5,2.5l6.7,2.5l4.5,0.5l6.3-0.3l4.2-0.3l2.5,1.3l0.7-1.3l5.5,0.3l3.5,3.5l0.8,3.7l1.2,5.2l2.3,2.5l-0.3,5.3l-2.3,5l-0.5,8l1,3.5l-0.3,5.5l-0.5,3l2.2,4.7l2,2.2l0.7,4.7l-2.2,4.2l-1.7,3l1,2.3l-0.5,3.5l-3.5,4.5l-3.7,1l-1.5,2.5l0.3,3.5l-4.5-0.2l-10.5,1.7l-8.5,0.5l-3.5-0.5l-3.3-3.5l-5.5,2l-3,3.7l-3,0l-0.5-3.3l-3.5-1.5l-0.7-5.3l-2-3.3l2.3-2.7l-1.3-3.5l-5-2.8l-0.3-3.2l1.8-3.5l-3.2-3.3l-3.3-5.5l-8-3.5l-2-4.5",
    WY: "M276.1,226.5l-21.7-1.5l-30.4-1.7l-34.2-1.2l-12.7-0.7l4.3-21.1l3.3-18.3l2.7-20.3l3-16.5l31.5,4.1l19.4,2l19,1.7l26,2l-1.7,14.7l-3,25.7l-1.7,17l-3.5,14.1"
  };

  // State name lookup
  var STATE_NAMES = {
    AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
    CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District of Columbia",
    FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",
    IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",
    ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",
    MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",
    NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",
    NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
    OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
    SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",
    VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"
  };

  // Small NE states that need callout labels
  var CALLOUT_STATES = ["VT","NH","MA","CT","RI","NJ","DE","MD","DC"];

  // Approximate center points for callout lines (hand-tuned for the 960x600 viewBox)
  var STATE_CENTERS = {
    VT: [843, 120],
    NH: [858, 110],
    MA: [862, 178],
    CT: [860, 188],
    RI: [865, 185],
    NJ: [830, 245],
    DE: [812, 265],
    MD: [800, 275],
    DC: [792, 287]
  };

  var container = document.getElementById("us-map");
  if (!container) return;

  // Count bills per state and track most significant status
  var STATUS_PRIORITY = {
    "Signed Into Law": 6,
    "Passed Both Chambers": 5,
    "Passed One Chamber": 4,
    "Introduced": 3,
    "Vetoed": 2,
    "Failed": 1
  };
  var billCounts = {};
  var stateStatus = {};  // most significant status per state
  var cards = document.querySelectorAll(".bill-card[data-state]");
  cards.forEach(function (card) {
    var st = card.getAttribute("data-state");
    var status = card.getAttribute("data-status");
    if (st) {
      billCounts[st] = (billCounts[st] || 0) + 1;
      var prev = stateStatus[st];
      if (!prev || (STATUS_PRIORITY[status] || 0) > (STATUS_PRIORITY[prev] || 0)) {
        stateStatus[st] = status;
      }
    }
  });

  var selectedState = "";
  var stateFilter = document.getElementById("filter-state");

  // Build SVG
  var svgNS = "http://www.w3.org/2000/svg";

  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 1050 650");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Interactive map of US states with tracked bills");
  svg.style.display = "block";

  // Defs for hover effect
  var style = document.createElementNS(svgNS, "style");
  style.textContent = [
    ".us-map-state { cursor: pointer; transition: fill 0.15s, stroke 0.15s; stroke: #cbd5e1; stroke-width: 1; fill: #f1f5f9; }",
    ".us-map-state.status-introduced { fill: #bfdbfe; stroke: #3b82f6; stroke-width: 1.2; }",
    ".us-map-state.status-passed-one { fill: #93c5fd; stroke: #2563eb; stroke-width: 1.2; }",
    ".us-map-state.status-passed-both { fill: #60a5fa; stroke: #1d4ed8; stroke-width: 1.2; }",
    ".us-map-state.status-signed { fill: #86efac; stroke: #16a34a; stroke-width: 1.2; }",
    ".us-map-state.status-vetoed { fill: #fca5a5; stroke: #dc2626; stroke-width: 1.2; }",
    ".us-map-state.status-failed { fill: #fca5a5; stroke: #dc2626; stroke-width: 1.2; }",
    ".us-map-state.selected { fill: #2563eb; stroke: #1d4ed8; stroke-width: 1.5; }",
    ".us-map-state:hover { filter: brightness(0.9); }",
    ".us-map-state.selected:hover { fill: #1d4ed8; }",
    ".us-map-callout-line { stroke: #94a3b8; stroke-width: 0.8; fill: none; }",
    ".us-map-callout-label { font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; cursor: pointer; }",
    ".us-map-callout-label .callout-bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 0.5; rx: 3; }",
    ".us-map-callout-label .callout-bg.has-bills { fill: #dbeafe; stroke: #2563eb; }",
    ".us-map-callout-label .callout-bg.selected { fill: #2563eb; stroke: #1d4ed8; }",
    ".us-map-callout-label text { fill: #475569; font-weight: 600; }",
    ".us-map-callout-label text.has-bills { fill: #1e40af; }",
    ".us-map-callout-label text.selected { fill: #ffffff; }",
    ".us-map-callout-label:hover .callout-bg { stroke-width: 1.2; }",
    ".us-map-tooltip { pointer-events: none; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
    ".us-map-tooltip rect { fill: #1e293b; rx: 4; }",
    ".us-map-tooltip text { fill: #fff; }"
  ].join("\n");
  svg.appendChild(style);

  // Group for state paths
  var statesGroup = document.createElementNS(svgNS, "g");
  statesGroup.setAttribute("class", "us-map-states");

  function statusClass(code) {
    var s = stateStatus[code];
    if (!s) return "";
    if (s === "Introduced") return "status-introduced";
    if (s === "Passed One Chamber") return "status-passed-one";
    if (s === "Passed Both Chambers") return "status-passed-both";
    if (s === "Signed Into Law") return "status-signed";
    if (s === "Vetoed") return "status-vetoed";
    if (s === "Failed") return "status-failed";
    return "";
  }

  var stateElements = {};

  Object.keys(PATHS).forEach(function (code) {
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", PATHS[code]);
    path.setAttribute("data-state", code);
    var cls = "us-map-state";
    var sc = statusClass(code);
    if (sc) cls += " " + sc;
    path.setAttribute("class", cls);
    path.addEventListener("click", function () {
      handleStateClick(code);
    });
    path.addEventListener("mouseenter", function (e) {
      showTooltip(e, code);
    });
    path.addEventListener("mousemove", function (e) {
      moveTooltip(e);
    });
    path.addEventListener("mouseleave", function () {
      hideTooltip();
    });
    statesGroup.appendChild(path);
    stateElements[code] = path;
  });

  svg.appendChild(statesGroup);

  // Callout labels group
  var calloutsGroup = document.createElementNS(svgNS, "g");
  calloutsGroup.setAttribute("class", "us-map-callouts");

  var calloutLabelX = 920;
  var calloutStartY = 95;
  var calloutSpacing = 24;
  var calloutElements = {};

  CALLOUT_STATES.forEach(function (code, i) {
    var center = STATE_CENTERS[code];
    if (!center) return;

    var labelY = calloutStartY + i * calloutSpacing;

    // Line from state center to label
    var line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", center[0]);
    line.setAttribute("y1", center[1]);
    line.setAttribute("x2", calloutLabelX - 30);
    line.setAttribute("y2", labelY);
    line.setAttribute("class", "us-map-callout-line");
    calloutsGroup.appendChild(line);

    // Label group
    var labelGroup = document.createElementNS(svgNS, "g");
    labelGroup.setAttribute("class", "us-map-callout-label");
    labelGroup.setAttribute("data-state", code);
    labelGroup.style.cursor = "pointer";

    var bgRect = document.createElementNS(svgNS, "rect");
    bgRect.setAttribute("x", calloutLabelX - 28);
    bgRect.setAttribute("y", labelY - 10);
    bgRect.setAttribute("width", 56);
    bgRect.setAttribute("height", 18);
    bgRect.setAttribute("rx", "3");
    var bgCls = "callout-bg";
    if (billCounts[code]) bgCls += " has-bills";
    bgRect.setAttribute("class", bgCls);

    var text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", calloutLabelX);
    text.setAttribute("y", labelY + 3);
    text.setAttribute("text-anchor", "middle");
    var textCls = billCounts[code] ? "has-bills" : "";
    if (textCls) text.setAttribute("class", textCls);
    text.textContent = code;

    labelGroup.appendChild(bgRect);
    labelGroup.appendChild(text);

    labelGroup.addEventListener("click", function () {
      handleStateClick(code);
    });
    labelGroup.addEventListener("mouseenter", function (e) {
      showTooltip(e, code);
    });
    labelGroup.addEventListener("mousemove", function (e) {
      moveTooltip(e);
    });
    labelGroup.addEventListener("mouseleave", function () {
      hideTooltip();
    });

    calloutsGroup.appendChild(labelGroup);
    calloutElements[code] = { group: labelGroup, bg: bgRect, text: text };
  });

  svg.appendChild(calloutsGroup);

  // Tooltip group (hidden by default)
  var tooltipGroup = document.createElementNS(svgNS, "g");
  tooltipGroup.setAttribute("class", "us-map-tooltip");
  tooltipGroup.style.display = "none";

  var tooltipBg = document.createElementNS(svgNS, "rect");
  tooltipBg.setAttribute("rx", "4");
  var tooltipText = document.createElementNS(svgNS, "text");
  tooltipText.setAttribute("dy", "0.35em");
  tooltipGroup.appendChild(tooltipBg);
  tooltipGroup.appendChild(tooltipText);
  svg.appendChild(tooltipGroup);

  container.appendChild(svg);

  // Tooltip helpers
  function showTooltip(e, code) {
    var name = STATE_NAMES[code] || code;
    var count = billCounts[code] || 0;
    var label = name + " (" + count + " bill" + (count !== 1 ? "s" : "") + ")";
    tooltipText.textContent = label;

    // Measure text
    var bbox = tooltipText.getBBox();
    var padX = 8, padY = 6;
    tooltipBg.setAttribute("width", bbox.width + padX * 2);
    tooltipBg.setAttribute("height", bbox.height + padY * 2);

    tooltipGroup.style.display = "";
    moveTooltip(e);
  }

  function moveTooltip(e) {
    var pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    var svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());

    var bbox = tooltipText.getBBox();
    var padX = 8, padY = 6;
    var tx = svgPt.x + 12;
    var ty = svgPt.y - 20;

    // Keep in bounds
    var bgW = bbox.width + padX * 2;
    if (tx + bgW > 1040) tx = svgPt.x - bgW - 8;
    if (ty < 5) ty = svgPt.y + 16;

    tooltipBg.setAttribute("x", tx);
    tooltipBg.setAttribute("y", ty);
    tooltipText.setAttribute("x", tx + padX);
    tooltipText.setAttribute("y", ty + (bbox.height + padY * 2) / 2);
  }

  function hideTooltip() {
    tooltipGroup.style.display = "none";
  }

  // State click handler
  function handleStateClick(code) {
    if (selectedState === code) {
      // Deselect
      selectedState = "";
    } else {
      selectedState = code;
    }
    updateSelection();
    if (stateFilter) {
      stateFilter.value = selectedState;
      stateFilter.dispatchEvent(new Event("change"));
    }
  }

  // Update visual selection
  function updateSelection() {
    // Update all state paths
    Object.keys(stateElements).forEach(function (code) {
      var el = stateElements[code];
      var cls = "us-map-state";
      if (code === selectedState) {
        cls += " selected";
      } else {
        var sc = statusClass(code);
        if (sc) cls += " " + sc;
      }
      el.setAttribute("class", cls);
    });

    // Update callout labels
    CALLOUT_STATES.forEach(function (code) {
      var ce = calloutElements[code];
      if (!ce) return;

      var bgCls = "callout-bg";
      var textCls = "";
      if (code === selectedState) {
        bgCls += " selected";
        textCls = "selected";
      } else if (billCounts[code]) {
        bgCls += " has-bills";
        textCls = "has-bills";
      }
      ce.bg.setAttribute("class", bgCls);
      ce.text.setAttribute("class", textCls);
    });
  }

  // Listen for external changes to the state filter dropdown
  if (stateFilter) {
    stateFilter.addEventListener("change", function () {
      var val = stateFilter.value;
      if (val !== selectedState) {
        selectedState = val;
        updateSelection();
      }
    });

    // Initialize from current dropdown value (if pre-set)
    if (stateFilter.value) {
      selectedState = stateFilter.value;
      updateSelection();
    }
  }
})();
