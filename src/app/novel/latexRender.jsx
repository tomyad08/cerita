import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

/**
 * LatexRenderer
 * @param {string} text - string yang mengandung $...$ atau $$...$$
 */
export function LatexRenderer({ text }) {
  // Regex: tangkap $$...$$ (block) atau $...$ (inline)
  const regex = /\$\$(.+?)\$\$|\$(.+?)\$/gs;

  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Tambahkan teks biasa sebelum math
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${key++}`}>{text.slice(lastIndex, match.index)}</span>
      );
    }

    if (match[1]) {
      // $$...$$ → BlockMath
      parts.push(<BlockMath math={match[1].trim()} key={`block-${key++}`} />);
    } else if (match[2]) {
      // $...$ → InlineMath
      parts.push(<InlineMath math={match[2].trim()} key={`inline-${key++}`} />);
    }

    lastIndex = regex.lastIndex;
  }

  // Tambahkan sisa teks biasa setelah math terakhir
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${key++}`}>{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
}
