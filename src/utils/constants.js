export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: 'js', icon: 'fab fa-js' },
  { value: 'typescript', label: 'TypeScript', extension: 'ts', icon: 'fab fa-js' },
  { value: 'html', label: 'HTML', extension: 'html', icon: 'fab fa-html5' },
  { value: 'css', label: 'CSS', extension: 'css', icon: 'fab fa-css3-alt' },
  { value: 'python', label: 'Python', extension: 'py', icon: 'fab fa-python' },
  { value: 'java', label: 'Java', extension: 'java', icon: 'fab fa-java' },
  { value: 'cpp', label: 'C++', extension: 'cpp', icon: 'fas fa-code' },
  { value: 'csharp', label: 'C#', extension: 'cs', icon: 'fas fa-code' }
];

export const THEMES = {
  dark: {
    primary: '#0d1f0d',
    secondary: '#2ecc71',
    accent: '#27ae60',
    light: '#ecf0f1',
    dark: '#0c130c',
    editor: '#1a1a1a',
    output: '#121212'
  },
  light: {
    primary: '#ffffff',
    secondary: '#2ecc71',
    accent: '#27ae60',
    light: '#333333',
    dark: '#f5f5f5',
    editor: '#f8f8f8',
    output: '#f0f0f0'
  }
};

export const DEFAULT_PERMISSIONS = {
  editCode: true,
  viewOnly: false,
  useMicrophone: true,
  useCamera: true,
  shareScreen: false,
  downloadCode: true
};

export const STATUS_MESSAGES = {
  loading: [
    "Initializing AI code analysis engine...",
    "Loading syntax parsers...",
    "Preparing collaboration tools...",
    "Establishing secure connection...",
    "Compiling neural networks...",
    "Optimizing algorithms...",
    "Building AST trees...",
    "Loading machine learning models...",
    "Finalizing code analysis modules...",
    "Ready to launch!"
  ]
};

export const CHATBOT_FAQS = [
  {
    question: "How to use CollabCode?",
    answer: "CollabCode is a collaborative coding platform. You can create or join rooms, write code together, use video calls, and chat with team members."
  },
  {
    question: "How to create a room?",
    answer: "As a teacher, log in and select 'Teacher' role. Then fill in room details and permissions, and click 'Create Room'."
  },
  {
    question: "How to share code?",
    answer: "Code is automatically shared in real-time when you're in a room. All participants can see and edit code based on permissions."
  },
  {
    question: "How to use video call?",
    answer: "Click the video icon in the top panel to open video call. Use the controls at the bottom to manage audio/video and screen sharing."
  }
];

export const API_ENDPOINTS = {
  auth: '/api/auth',
  rooms: '/api/rooms',
  users: '/api/users',
  code: '/api/code',
  messages: '/api/messages'
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  CODE_CHANGE: 'code-change',
  CURSOR_MOVE: 'cursor-move',
  CHAT_MESSAGE: 'chat-message',
  VIDEO_STATE: 'video-state',
  SCREEN_SHARE: 'screen-share'
};