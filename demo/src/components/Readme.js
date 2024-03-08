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
  
    let updatedContent = content;
    let hiddenSectionStart = updatedContent.indexOf(hideSectionStartTag);
    let hiddenSectionEnd = updatedContent.indexOf(hideSectionEndTag);
  
    while (hiddenSectionStart !== -1 && hiddenSectionEnd !== -1) {
      const beforeHidden = updatedContent.substring(0, hiddenSectionStart);
      const afterHidden = updatedContent.substring(hiddenSectionEnd + hideSectionEndTag.length);
      updatedContent = beforeHidden + afterHidden;
  
      hiddenSectionStart = updatedContent.indexOf(hideSectionStartTag);
      hiddenSectionEnd = updatedContent.indexOf(hideSectionEndTag);
    }
  
    return updatedContent;
  }  

  useEffect(() => {
    fetchReadme();
  }, []);

  return (
    <section className="sm:mt-4 sm:px-4">
      <div className="prose prose-neutral prose-code:bg-neutral-700 prose-code:rounded prose-code:p-1 prose-code:before:content-none prose-code:after:content-none dark:prose-invert max-w-5xl mx-auto p-4 sm:border rounded-lg border-neutral-600 mb-8">
        <div className="flex flex-wrap mb-4 -m-1">
          <a href="https://github.com/krestaino/podcast-xml-parser">
            <img
              alt="GitHub Repo"
              src="https://img.shields.io/github/package-json/v/krestaino/podcast-xml-parser/main?label=GitHub"
              className="m-1"
            />
          </a>
          <a href="https://www.npmjs.com/package/podcast-xml-parser">
            <img
              alt="NPM Package"
              src="https://img.shields.io/npm/v/podcast-xml-parser?color=red"
              className="m-1"
            />
          </a>
          <a href="https://raw.githubusercontent.com/krestaino/podcast-xml-parser/main/LICENSE.md">
            <img
              alt="MIT License"
              src="https://img.shields.io/github/license/krestaino/podcast-xml-parser.svg"
              className="m-1"
            />
          </a>
          <a href="https://github.com/krestaino/podcast-xml-parser/actions/workflows/build.yml">
            <img
              alt="Build"
              src="https://img.shields.io/github/actions/workflow/status/krestaino/podcast-xml-parser/build.yml"
              className="m-1"
            />
          </a>
          <a href="https://codecov.io/github/krestaino/podcast-xml-parser">
            <img
              alt="Codecov"
              src="https://codecov.io/github/krestaino/podcast-xml-parser/graph/badge.svg?token=IS0T58N4FQ"
              className="m-1"
            />
          </a>
          <a href="https://podcast-xml-parser.kmr.io/">
            <img
              alt="Live Demo"
              src="https://img.shields.io/badge/demo-live-blueviolet"
              className="m-1"
            />
          </a>
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
