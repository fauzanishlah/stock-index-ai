// // src/components/MarkdownComponents.tsx
// import React, {
//   ReactNode,
//   AnchorHTMLAttributes,
//   ImgHTMLAttributes,
//   HTMLAttributes,
// } from "react";
import { ExtraProps } from "react-markdown";

// // Define interfaces for props if they get more complex
// interface ElementProps {
//   children?: ReactNode;
//   // The 'node' prop is available from react-markdown, exclude it if not used to avoid React warnings
//   node?: any;
// }

// interface LinkProps
//   extends ElementProps,
//     AnchorHTMLAttributes<HTMLAnchorElement> {
//   href?: string;
// }

// interface ImageProps extends ElementProps, ImgHTMLAttributes<HTMLImageElement> {
//   src?: string;
//   alt?: string;
// }

// // Custom H1
// export const CustomH1: React.FC<ElementProps> = ({ children }) => {
//   return <h1 className="text-4xl font-bold text-blue-600 my-4">{children}</h1>;
// };

// // Custom H2
// export const CustomH2: React.FC<ElementProps> = ({ children }) => {
//   return (
//     <h2 className="text-3xl font-semibold text-blue-500 my-3">{children}</h2>
//   );
// };

// // Custom Paragraph
// export const CustomParagraph: React.FC<ElementProps> = ({ children }) => {
//   return (
//     <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
//       {children}
//     </p>
//   );
// };

// // Custom Link
// export const CustomLink: React.FC<LinkProps> = ({ href, children }) => {
//   return (
//     <a
//       href={href}
//       className="text-green-500 hover:text-green-700 underline"
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       {children}
//     </a>
//   );
// };

// // Custom Image
// export const CustomImage: React.FC<ImageProps> = ({ src, alt }) => {
//   return (
//     <img
//       src={src}
//       alt={alt}
//       className="rounded-lg shadow-md my-4 max-w-full h-auto"
//     />
//   );
// };

// // Custom Unordered List
// export const CustomUl: React.FC<ElementProps> = ({ children }) => {
//   return (
//     <ul className="list-disc list-inside pl-5 mb-4 text-black">{children}</ul>
//   );
// };

// // Custom Ordered List
// export const CustomOl: React.FC<ElementProps> = ({ children }) => {
//   return (
//     <ol className="list-decimal list-inside pl-5 mb-4 dark:text-gray-300">
//       {children}
//     </ol>
//   );
// };

// // Custom List Item
// export const CustomLi: React.FC<ElementProps> = ({ children }) => {
//   return <li className="mb-1">{children}</li>;
// };

// // Custom Blockquote
// export const CustomBlockquote: React.FC<ElementProps> = ({ children }) => {
//   return (
//     <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
//       {children}
//     </blockquote>
//   );
// };

// // Custom Code Block (inline)
// export const CustomCode: React.FC<
//   ElementProps & HTMLAttributes<HTMLElement>
// > = ({ children, className, ...props }) => {
//   // react-markdown might pass a className like "language-js"
//   // You can use this for syntax highlighting libraries if needed
//   if (className?.startsWith("language-")) {
//     // Handle block code differently if desired, or pass to a syntax highlighter
//     return (
//       <pre
//         className={`bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto ${className}`}
//       >
//         <code {...props}>{children}</code>
//       </pre>
//     );
//   }
//   return (
//     <code
//       className="bg-gray-200 dark:bg-gray-700 text-red-500 dark:text-red-400 px-1 py-0.5 rounded text-sm"
//       {...props}
//     >
//       {children}
//     </code>
//   );
// };

// ex
export const MarkdownComponents = {
  // h1: ({ node, ...props }: ExtraProps) => (
  //   <h1 {...props} className="text-2xl font-bold" />
  // ),
  // h2: ({ node, ...props }: ExtraProps) => (
  //   <h2 {...props} className="text-xl font-semibold" />
  // ),
  // h3: ({ node, ...props }: ExtraProps) => (
  //   <h3 {...props} className="text-lg font-medium" />
  // ),
  // p: ({ node, ...props }: ExtraProps) => (
  //   <p {...props} className="text-base leading-relaxed" />
  // ),
  // a: ({ node, ...props }: ExtraProps) => (
  //   <a
  //     {...props}
  //     className="text-blue-600 hover:underline"
  //     target="_blank"
  //     rel="noopener noreferrer"
  //   />
  // ),
  // code: ({ node, ...props }: ExtraProps) => (
  //   <code {...props} className="bg-gray-100 p-1 rounded text-sm font-mono" />
  // ),
  // pre: ({ node, ...props }: ExtraProps) => (
  //   <pre
  //     {...props}
  //     className="bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto"
  //   />
  // ),
  // blockquote: ({ node, ...props }: ExtraProps) => (
  //   <blockquote
  //     {...props}
  //     className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
  //   />
  // ),
  ul: ({ node, ...props }: ExtraProps) => (
    <ul {...props} className="list-disc list-inside pl-5 mb-4 text-black" />
  ),
  ol: ({ node, ...props }: ExtraProps) => (
    <ol {...props} className="list-decimal list-inside pl-5 mb-4" />
  ),
  li: ({ node, ...props }: ExtraProps) => <li {...props} className="mb-1" />,
  // img: ({ node, ...props }: ExtraProps) => (
  //   <img
  //     {...props}
  //     className="max-w-full h-auto rounded"
  //     alt={(props as any).alt || "Image"}
  //   />
  // ),
  // table: ({ node, ...props }: ExtraProps) => (
  //   <table
  //     {...props}
  //     className="min-w-full border-collapse border border-gray-300"
  //   />
  // ),
  // th: ({ node, ...props }: ExtraProps) => (
  //   <th
  //     {...props}
  //     className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold"
  //   />
  // ),
  // td: ({ node, ...props }: ExtraProps) => (
  //   <td
  //     {...props}
  //     className="border border-gray-300 px-4 py-2 text-base leading-relaxed"
  //   />
  // ),
  // hr: ({ node, ...props }: ExtraProps) => (
  //   <hr {...props} className="border-t border-gray-300 my-4" />
  // ),
};
