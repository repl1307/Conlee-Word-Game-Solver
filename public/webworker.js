onmessage = e => {
  postMessage((e.data.count*e.data.percentage)+'px');
}