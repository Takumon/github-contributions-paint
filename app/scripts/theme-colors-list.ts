const github      = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
const halloween   = ['#ebedf0', '#fdf156', '#ffc722', '#ff9711', '#04001b'];

const amber       = ['#ebedf0', '#ffecb3', '#ffd54f', '#ffb300', '#ff6f00'];
const blue        = ['#ebedf0', '#bbdefb', '#64b5f6', '#1e88e5', '#0d47a1'];
const bluegrey    = ['#ebedf0', '#cfd8dc', '#90a4ae', '#546e7a', '#263238'];
const brown       = ['#ebedf0', '#d7ccc8', '#a1887f', '#6d4c41', '#3e2723'];
const cyan        = ['#ebedf0', '#b2ebf2', '#4dd0e1', '#00acc1', '#006064'];
const deeporange  = ['#ebedf0', '#ffccbc', '#ff8a65', '#f4511e', '#bf360c'];
const deeppurple  = ['#ebedf0', '#d1c4e9', '#9575cd', '#5e35b1', '#311b92'];
const green       = ['#ebedf0', '#c8e6c9', '#81c784', '#43a047', '#1b5e20'];
const grey        = ['#ebedf0', '#e0e0e0', '#9e9e9e', '#616161', '#212121'];
const indigo      = ['#ebedf0', '#c5cae9', '#7986cb', '#3949ab', '#1a237e'];
const lightblue   = ['#ebedf0', '#b3e5fc', '#4fc3f7', '#039be5', '#01579b'];
const lightgreen  = ['#ebedf0', '#dcedc8', '#aed581', '#7cb342', '#33691e'];
const lime        = ['#ebedf0', '#f0f4c3', '#dce775', '#c0ca33', '#827717'];
const orange      = ['#ebedf0', '#ffe0b2', '#ffb74d', '#fb8c00', '#e65100'];
const pink        = ['#ebedf0', '#f8bbd0', '#f06292', '#e91e63', '#880e4f'];
const purple      = ['#ebedf0', '#e1bee7', '#ba68c8', '#8e24aa', '#4a148c'];
const red         = ['#ebedf0', '#ffcdd2', '#e57373', '#e53935', '#b71c1c'];
const teal        = ['#ebedf0', '#b2dfdb', '#4db6ac', '#00897b', '#004d40'];
const yellowMd    = ['#ebedf0', '#fff9c4', '#fff176', '#ffd835', '#f57f17'];

const moon        = ['#ebedf0', '#6bcdff', '#00a1f3', '#48009a', '#4f2266'];
const psychedelic = ['#ebedf0', '#faafe1', '#fb6dcc', '#fa3fbc', '#ff00ab'];
const yellow      = ['#ebedf0', '#d7d7a2', '#d4d462', '#e0e03f', '#ffff00'];



interface ColorsType {
  [index: string]: Array<string>;
}

/**
 * テーマごとの色リストをまとめたもの
 */
export const themeColorsList: ColorsType = {
  github,
  halloween,

  amber,
  blue,
  bluegrey,
  brown,
  cyan,
  deeporange,
  deeppurple,
  green,
  grey,
  indigo,
  lightblue,
  lightgreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellowMd,

  moon,
  psychedelic,
  yellow,
};