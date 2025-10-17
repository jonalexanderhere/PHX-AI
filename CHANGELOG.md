# 📝 Changelog - PHX-AI

## [Latest Update] - 2025-01-17

### ✨ New Features

#### 🎛️ **Sidebar Hide/Show Toggle**
- Added toggle button untuk hide/show sidebar
- Smooth animation dengan transition duration 300ms
- Persistent state menggunakan Zustand store
- Desktop: Button di top-left corner
- Hover effects dengan blue accent
- Icon: ChevronLeft (hide) / ChevronRight (show)
- Show Sidebar button muncul di ChatArea saat sidebar hidden

**How to use:**
1. Click button di top-left corner untuk toggle
2. Atau click "Show Sidebar" button di chat area
3. State akan persist selama session

#### 🔧 **Fixed: AI Service Configuration**
- Fixed HF_TOKEN environment variable loading
- Added fallback ke NEXT_PUBLIC_HF_TOKEN
- Better error messages
- Enhanced logging untuk debugging

---

## Previous Updates

### [2025-01-17] - LaTeX Math & Modern UI

#### 📐 **LaTeX Math Support**
- Inline math dengan `$...$`
- Block math dengan `$$...$$`
- Beautiful gradient backgrounds untuk equations
- Full KaTeX support
- Responsive math rendering

#### 💻 **Enhanced Code Blocks**
- Syntax highlighting dengan Prism.js
- Copy button (hover to show)
- Line numbers
- VS Code Dark+ theme
- Support 50+ programming languages

#### 🎨 **Modern UI Overhaul**
- Gradient backgrounds (blue → purple)
- Larger avatars (12x12)
- Better rounded corners (rounded-3xl)
- Shadow effects
- Smooth animations
- Better typography
- Improved spacing

#### 🎭 **Better Message Bubbles**
- User: Gradient blue bubble
- AI: White dengan border dan shadow
- Hover effects
- Better padding dan spacing

#### 📱 **Improved Welcome Screen**
- Gradient background
- Emoji icons untuk suggestions
- Tips section
- Modern card design
- Hover animations

---

### [2025-01-16] - Initial Release

#### ⚡ **Core Features**
- Next.js 14 dengan App Router
- Supabase Authentication
- Supabase Database (PostgreSQL)
- DeepSeek-R1 AI Model via Hugging Face
- Real-time chat
- Session management
- Message history
- User profiles

#### 🔐 **Security**
- Row Level Security (RLS)
- Authentication required
- Protected API routes
- Secure session handling

#### 💾 **Database**
- chat_sessions table
- messages table
- user_profiles table
- Automatic timestamps
- Cascade deletes

---

## 🚀 Coming Soon

### Planned Features
- [ ] Export chat history (PDF, Markdown)
- [ ] Search dalam chat history
- [ ] Dark mode
- [ ] Custom themes
- [ ] Voice input (optional)
- [ ] Multi-language support
- [ ] Chat folders/categories
- [ ] Keyboard shortcuts
- [ ] Code execution (sandboxed)
- [ ] Math equation solver
- [ ] Graph/chart generation

### Improvements
- [ ] Faster response times
- [ ] Better mobile UX
- [ ] Offline mode
- [ ] PWA support
- [ ] Desktop app (Electron)

---

## 🐛 Bug Fixes

### Latest (2025-01-17)
- ✅ Fixed HF_TOKEN environment variable not loading
- ✅ Fixed API 500 errors dengan better error handling
- ✅ Fixed sidebar responsive issues
- ✅ Fixed message bubble alignment
- ✅ Fixed LaTeX rendering pada mobile

### Previous
- ✅ Fixed TypeScript errors
- ✅ Fixed authentication redirect loop
- ✅ Fixed database connection issues
- ✅ Fixed markdown rendering
- ✅ Fixed code highlighting

---

## 📊 Performance

### Optimizations
- Lazy loading untuk heavy components
- Code splitting
- Image optimization
- KaTeX (faster than MathJax)
- Efficient state management

### Metrics
- First Load: ~102 KB
- Dashboard: ~410 KB
- API Response: < 3s (average)
- Build Time: ~30s

---

## 🔄 Breaking Changes

### None Yet
Current version is stable dan backward compatible.

---

## 📖 Documentation

### Updated Docs
- ✅ README.md - Main documentation
- ✅ FEATURES.md - Feature guide
- ✅ SETUP_COMPLETE.md - Setup instructions
- ✅ DATABASE_SETUP.md - Database guide
- ✅ CHANGELOG.md - This file

---

## 🙏 Acknowledgments

### Technologies Used
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3
- Supabase
- Hugging Face
- DeepSeek-R1
- KaTeX
- Prism.js
- Zustand
- Framer Motion

---

## 📞 Support

Found a bug? Have a feature request?
- Open an issue on GitHub
- Check documentation
- Run `npm run setup` untuk troubleshooting

---

**Happy Coding! 🚀**

