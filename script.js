
// Kết nối tới server MQTT
const client = mqtt.connect('14.255.255.37:1883', {
  clientId: 'my-client-id-' + Math.random().toString(16).substr(2, 8), // Tạo client ID ngẫu nhiên
  keepalive: 60, // Giữ kết nối 60 giây
  clean: true, // Dọn dẹp session
  reconnectPeriod: 5000, // Kết nối lại sau 5 giây nếu bị ngắt
});


// Lấy phần tử hiển thị trạng thái kết nối
const connectionStatus = document.getElementById('connection-status');

// Danh sách các channel
let channels = [];

// Kết nối thành công
client.on('connect', () => {
  console.log('Connected to MQTT server');
  connectionStatus.textContent = 'Đã kết nối tới MQTT server';
  connectionStatus.className = 'connected'; // Thêm class để thay đổi màu nền
});

// Xử lý lỗi
client.on('error', (err) => {
  console.error('Connection error:', err);
  connectionStatus.textContent = 'Lỗi kết nối tới MQTT server';
  connectionStatus.className = 'disconnected'; // Thêm class để thay đổi màu nền
});

// Kết nối bị ngắt
client.on('close', () => {
  console.log('Connection closed');
  connectionStatus.textContent = 'Mất kết nối tới MQTT server';
  connectionStatus.className = 'disconnected'; // Thêm class để thay đổi màu nền
});

// Hàm thêm channel mới
function addChannel(channelName, macroName) {
  console.log('Thêm channel:', channelName, macroName); // Kiểm tra dữ liệu nhập vào
  const channel = { channelName, macroName };
  channels.push(channel);
  renderChannels();
}

// Hàm hiển thị danh sách channel
function renderChannels() {
  const channelList = document.getElementById('channel-list');
  console.log('Render channels:', channels); // Kiểm tra danh sách channels
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
  console.log('Nút "Thêm Channel" đã được nhấn'); // Kiểm tra xem sự kiện có hoạt động không
  const channelName = prompt('Nhập tên channel:');
  const macroName = prompt('Nhập macro name:');
  if (channelName && macroName) {
    addChannel(channelName, macroName);
  }
});