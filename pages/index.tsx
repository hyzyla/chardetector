import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { UnicodeBlock, getUnicodeBlock } from "../utils/unicode";
import { useRouter } from "next/router";
import { base64UrlDecode, base64UrlEncode } from "../utils/base";

const Home: NextPage = () => {
  // const [value, setValue] = useState<string>("Пpивiт!");
  const { push, query } = useRouter();
  const [higlightedBlock, setHighlightedBlock] =
    useState<UnicodeBlock | null>();

  const queryValue = (query.value as string) ?? null;
  const value: string =
    queryValue !== null ? base64UrlDecode(queryValue) : "Привіт!";

  const setValue = (value: string) => {
    push({ query: { ...query, value: base64UrlEncode(value) } }, undefined, {
      shallow: true,
    });
  };

  const onBlockClick = (block: UnicodeBlock) => {
    if (higlightedBlock?.name === block.name) {
      setHighlightedBlock(null);
      return;
    } else {
      setHighlightedBlock(block);
    }
  };

  const valueBlocks = value.split("").map((char, index) => {
    const block = getUnicodeBlock(char);
    return {
      char,
      block,
    };
  });

  const onValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setHighlightedBlock(null);
  };

  // Get unique blocks preserving order and skip unknown blocks
  const uniqueBlocks: UnicodeBlock[] = valueBlocks
    .map(({ block }) => block)
    .filter((block, index, blocks) => blocks.indexOf(block) === index);

  const opacity = 0.1;

  return (
    <div>
      <Head>
        <title>Character Detector</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100  min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-5 pt-3">
            <TextareaAutosize
              className="shadow-sm rounded p-2 w-full resize-none font-mono"
              value={value}
              minRows={5}
              onChange={onValueChange}
            />
            <div className="shadow-sm rounded p-2 w-full bg-white grid gap-[2px] grid-cols-[repeat(auto\-fill,2.5rem)]">
              {valueBlocks.map(({ char, block }, index) => {
                const color = block.color;
                const isHighlighted = higlightedBlock?.name === block.name;
                const isActive = isHighlighted || !higlightedBlock;
                return (
                  <div
                    className="rounded w-10 h-10 flex items-center justify-center border-[1px] text-white cursor-pointer select-none"
                    style={{
                      backgroundColor: color,
                      opacity: isActive ? 1 : opacity,
                    }}
                    key={index}
                    title={block.name}
                    onClick={() => onBlockClick(block)}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
            <div className="shadow-sm rounded p-2 w-full bg-white grid gap-[2px]">
              {uniqueBlocks.map((block, index) => {
                const isHighlighted = higlightedBlock?.name === block.name;
                const isActive = isHighlighted || !higlightedBlock;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="rounded h-10 w-10  border-[1px] p-3 text-white cursor-pointer select-none"
                      style={{
                        backgroundColor: block.color,
                        opacity: isActive ? 1 : opacity,
                      }}
                      title={block.name}
                      onClick={() => onBlockClick(block)}
                    />
                    <div>{block.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
