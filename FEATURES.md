# 🎨 PHOENIX AI - Features & Usage Guide

## ✨ New Features (Latest Update)

### 📐 LaTeX Math Support
PHOENIX AI sekarang mendukung rendering persamaan matematika dengan LaTeX!

#### Inline Math
Gunakan `$...$` untuk math inline:
```
Persamaan Pythagoras: $a^2 + b^2 = c^2$
```

#### Block Math
Gunakan `$$...$$` untuk math block:
```
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

#### Contoh Kompleks:
```
$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

Untuk matriks:
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
```

---

### 💻 Enhanced Code Support

#### Code Blocks dengan Syntax Highlighting
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

Didukung bahasa:
- Python
- JavaScript/TypeScript
- Java
- C/C++
- HTML/CSS
- SQL
- Dan banyak lagi!

#### Copy Code Button
Setiap code block memiliki tombol copy yang muncul saat hover. Klik untuk copy code ke clipboard!

#### Line Numbers
Semua code blocks memiliki line numbers untuk referensi mudah.

---

### 🎨 Modern UI Improvements

#### 1. **Message Bubbles**
- User messages: Gradient blue dengan rounded corners modern
- AI messages: White dengan border, shadow yang elegant
- Avatar yang lebih besar dan modern dengan gradient

#### 2. **Animations**
- Fade in effect untuk setiap message
- Smooth transitions
- Hover effects pada suggestions dan buttons
- Pulse animation pada AI avatar

#### 3. **Better Typography**
- Improved line spacing
- Better font sizes
- Enhanced readability

#### 4. **Enhanced Input**
- Larger input area
- Better placeholder text
- Gradient button dengan hover effects
- Scale animation pada button

#### 5. **Welcome Screen**
- Gradient background
- Emoji icons untuk suggestions
- Modern card design dengan hover effects
- Specific suggestions untuk:
  - ✍️ Writing
  - 💻 Programming
  - 🔢 Mathematics
  - 📊 Data Analysis

---

## 📝 Markdown Support

### Headings
```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

### Lists
```markdown
- Unordered list
- Item 2
  - Sub item

1. Ordered list
2. Item 2
```

### Emphasis
```markdown
**Bold text**
*Italic text*
`Inline code`
```

### Blockquotes
```markdown
> This is a blockquote
> Multiple lines
```

### Tables
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

---

## 🔢 Math Examples

### Basic Operations
```
Inline: $x + y = z$
```

### Fractions
```
$$\frac{a}{b} = c$$
```

### Subscripts & Superscripts
```
$x^2$, $x_1$, $x_1^2$
```

### Greek Letters
```
$\alpha$, $\beta$, $\gamma$, $\delta$, $\pi$, $\sigma$
```

### Integrals
```
$$\int_0^1 x^2 dx = \frac{1}{3}$$
```

### Summation
```
$$\sum_{i=1}^n i = \frac{n(n+1)}{2}$$
```

### Matrices
```
$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix}
$$
```

### Complex Equations
```
$$
E = mc^2
$$

$$
\nabla \times \vec{E} = -\frac{\partial \vec{B}}{\partial t}
$$
```

---

## 💡 Usage Tips

### For Mathematics
1. Always use `$` for inline math: `$x^2$`
2. Use `$$` for display math (centered, larger)
3. Use `\frac{}{}` for fractions
4. Use `^` for superscripts, `_` for subscripts
5. Use `\sqrt{}` for square roots

### For Programming
1. Specify language in code blocks: ` ```python `
2. Use inline code for function names: `` `function()` ``
3. Add comments in code for better explanation
4. Use proper indentation

### For General Chat
1. Use **bold** for emphasis
2. Use lists for structured information
3. Use > for important notes/quotes
4. Break long text into paragraphs

---

## 🎯 Best Practices

### Asking Math Questions
```
❌ Bad: "solve x2+2x+1"
✅ Good: "Tolong selesaikan persamaan kuadrat $x^2 + 2x + 1 = 0$"
```

### Asking Code Questions
```
❌ Bad: "fix my code"
✅ Good: "Tolong review code Python ini dan berikan saran perbaikan:
\`\`\`python
def calculate(x):
    return x * 2
\`\`\`
```

### General Questions
```
❌ Bad: "cara buat website"
✅ Good: "Tolong jelaskan langkah-langkah membuat website modern dengan:
- Frontend framework yang cocok
- Backend technology
- Database recommendation
- Deployment options"
```

---

## 🚀 Example Conversations

### Example 1: Math Problem
**User:** Jelaskan teorema Pythagoras dan berikan contoh soal

**AI Response will include:**
- LaTeX equations: $a^2 + b^2 = c^2$
- Visual explanation
- Example problems with step-by-step solutions
- Beautiful math formatting

### Example 2: Coding Help
**User:** Buatkan fungsi sorting dengan bubble sort dalam Python

**AI Response will include:**
- Syntax highlighted code
- Copy button untuk code
- Line numbers
- Detailed explanation
- Time complexity analysis

### Example 3: Mixed Content
**User:** Jelaskan algoritma RSA dalam kriptografi

**AI Response will include:**
- Math equations untuk key generation
- Code examples untuk implementation
- Tables untuk comparison
- Formatted lists untuk steps

---

## 📊 UI Components

### Message Components
- **User Avatar**: Gray gradient circle
- **AI Avatar**: Blue-purple gradient with sparkles
- **User Bubble**: Blue gradient, rounded corners
- **AI Bubble**: White with border, shadow
- **Timestamp**: Below each message

### Code Components
- **Syntax Highlighter**: VS Code Dark+ theme
- **Copy Button**: Appears on hover
- **Line Numbers**: Auto-generated
- **Language Badge**: (Optional, can be added)

### Math Components
- **Inline Math**: Integrated in text
- **Display Math**: Centered, larger, with background
- **Special Symbols**: Full LaTeX support

---

## 🔥 Performance

- **Fast Rendering**: KaTeX for math (faster than MathJax)
- **Optimized Code**: Prism.js for syntax highlighting
- **Lazy Loading**: Images and heavy content
- **Responsive**: Works on all screen sizes

---

## 📱 Mobile Support

All features work perfectly on mobile:
- Touch-friendly buttons
- Responsive layouts
- Optimized font sizes
- Proper scrolling

---

## 🎓 Learn More

### LaTeX Resources
- [LaTeX Math Symbols](https://www.overleaf.com/learn/latex/List_of_Greek_letters_and_math_symbols)
- [KaTeX Supported Functions](https://katex.org/docs/supported.html)

### Markdown Resources
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Markdown Guide](https://www.markdownguide.org/)

### Code Highlighting
- [Prism.js Languages](https://prismjs.com/#supported-languages)

---

**Enjoy the enhanced PHOENIX AI experience! 🚀**

