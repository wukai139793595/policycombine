import axios from 'axios'
export function checkName (value) {
    let newStr = String(value);
    return /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(newStr);
}

export function checkPhone (value) {
    let newStr = String(value);
    return /^1[34578]\d{9}$/.test(newStr)
}

export function checkEmail (value) {
    let newStr = String(value);
    return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(newStr)
}

export function checkIdcard (value) {
    let newStr = String(value);
    return /\d{15}|\d{18}|\d{17}[Xx]/.test(newStr)
}

  //判断设备类型是不是pc
export  function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  };
  //去掉字符串中的空格
export  function Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  };
  //身份证判断
export  function IdentityCodeValid(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
      },
      tip = "",
      pass = !0;
    if (
      ((code = code.toUpperCase()),
      code &&
        /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(
          code
        ))
    )
      if (city[code.substr(0, 2)]) {
        if (18 == code.length) {
          code = code.split("");
          for (
            var factor = [
                7,
                9,
                10,
                5,
                8,
                4,
                2,
                1,
                6,
                3,
                7,
                9,
                10,
                5,
                8,
                4,
                2
              ],
              parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2],
              sum = 0,
              ai = 0,
              wi = 0,
              i = 0;
            i < 17;
            i++
          )
            (ai = code[i]), (wi = factor[i]), (sum += ai * wi);
          parity[sum % 11];
          parity[sum % 11] != code[17] &&
            ((tip = "身份证号输入错误"), (pass = !1));
        }
      } else (tip = "地址编码错误"), (pass = !1);
    else (tip = "身份证号格式错误"), (pass = !1);
    return [pass, tip];
  };