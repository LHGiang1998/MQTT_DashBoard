// Kết nối MQTT server
const client = mqtt.connect('14.225.255.37:8000/mqtt'); // Thay thế bằng MQTT broker của bạn

// Danh sách các channel
let channels = [];

// Kết nối thành công
client.on('connect', () => {
  console.log('Connected to MQTT server');
});

// Xử lý lỗi
client.on('error', (err) => {
  console.error('Connection error:', err);
});

// Hàm thêm channel mới
function addChannel(channelName, macroName) {
  const channel = { channelName, macroName };
  channels.push(channel);
  renderChannels();
}

// Hàm hiển thị danh sách channel
function renderChannels() {
  const channelList = document.getElementById('channel-list');
  channelList.innerHTML = ''; // Xóa nội dung cũ

  channels.forEach((channel, index) => {
    const channelDiv = document.createElement('div');
    channelDiv.className = 'channel';

    const channelInfo = document.createElement('span');
    channelInfo.textContent = `${channel.channelName} (${channel.macroName})`;

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Gửi lệnh';
    sendButton.onclick = () => sendCommand(channel.channelName, channel.macroName);

    channelDiv.appendChild(channelInfo);
    channelDiv.appendChild(sendButton);
    channelList.appendChild(channelDiv);
  });
}

// Hàm gửi lệnh đến MQTT server
function sendCommand(channelName, macroName) {
  const topic = channelName;
  const message = macroName;
  client.publish(topic, message);
  console.log(`Đã gửi lệnh: ${message} đến channel: ${topic}`);
}

// Thêm sự kiện cho nút "Thêm Channel"
document.getElementById('add-channel-btn').addEventListener('click', () => {
  const channelName = prompt('Nhập tên channel:');
  const macroName = prompt('Nhập macro name:');
  if (channelName && macroName) {
    addChannel(channelName, macroName);
  }
});