import { TIMEOUT_SEC } from '../config';

//相当于一个闹钟 让获取数据的闹钟比赛 如果获取数据的时间过长 那么就反应错误而不是让用户一直傻等
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//从服务器获取数据
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}(${res.ok})`);
    return data;
  } catch (error) {
    throw error; //把错误传递下去 让控制台打印真正的错误
  }
};

//通过api把数据传到服务器 然后返回服务器的那个格式的数据 得到数据之后可以放到state里面
export const sendJSON = async function (url, upload) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(upload),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}(${res.ok})`);
    return data;
  } catch (error) {
    throw error; //把错误传递下去 让控制台打印真正的错误
  }
};
