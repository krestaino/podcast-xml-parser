import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Readme() {
  const [readmeContent, setReadmeContent] = useState("");

  async function fetchReadme() {
    try {
      const readmeUrl = "https://raw.githubusercontent.com/krestaino/podcast-xml-parser/main/README.md";
      const response = await fetch(readmeUrl);
      const readmeText = await response.text();
      setReadmeContent(readmeText);
    } catch (error) {
      console.error("Error fetching README.md:", error);
    }
  }

  function preprocessReadmeContent(content) {
    const hideSectionStartTag = "<!-- HIDE_SECTION_START -->";
    const hideSectionEndTag = "<!-- HIDE_SECTION_END -->";

    const hiddenSectionStart = content.indexOf(hideSectionStartTag);
    const hiddenSectionEnd = content.indexOf(hideSectionEndTag);

    if (hiddenSectionStart !== -1 && hiddenSectionEnd !== -1) {
      const beforeHidden = content.substring(0, hiddenSectionStart);
      const afterHidden = content.substring(hiddenSectionEnd + hideSectionEndTag.length);
      return beforeHidden + afterHidden;
    }

    return content;
  }

  useEffect(() => {
    fetchReadme();
  }, []);

  return (
    <section className="mt-4">
      <div className="prose prose-neutral prose-code:bg-neutral-700 prose-code:rounded prose-code:p-1 prose-code:before:content-none prose-code:after:content-none dark:prose-invert max-w-5xl mx-auto p-4 border rounded-lg border-neutral-600 mb-8">
        <div className="flex mb-4">
          <a href="https://github.com/krestaino/podcast-xml-parser">
            <img
              alt="GitHub Repo"
              src="https://img.shields.io/github/package-json/v/krestaino/podcast-xml-parser/main?label=GitHub"
              className="m-0"
            />
          </a>
          <a href="https://www.npmjs.com/package/podcast-xml-parser">
            <img
              alt="NPM Package"
              src="https://img.shields.io/npm/v/podcast-xml-parser?color=red"
              className="m-0 ml-2"
            />
          </a>
          <img
            alt="MIT License"
            src="https://img.shields.io/github/license/krestaino/podcast-xml-parser.svg"
            className="m-0 ml-2"
          />
        </div>
        <ReactMarkdown
          children={preprocessReadmeContent(readmeContent)}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, "")}
                  style={a11yDark}
                  language={match[1]}
                  PreTag="div"
                />
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
    </section>
  );
}
