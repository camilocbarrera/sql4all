import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "fs";
import { join } from "path";

const WIDTH = 1200;
const HEIGHT = 630;

// Dark mode theme colors (from globals.css)
const colors = {
  background: "#1a1d1e",
  card: "#222628",
  foreground: "#f0f2f3",
  primary: "#4db8d5",
  muted: "#a0a4a6",
  border: "#3a3e40",
};

async function generateOG() {
  // Fetch Inter font (regular weight)
  const interRes = await fetch(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
  );
  const interData = await interRes.arrayBuffer();

  // Fetch Inter font (semibold weight)
  const interSemiboldRes = await fetch(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff"
  );
  const interSemiboldData = await interSemiboldRes.arrayBuffer();

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: colors.background,
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              },
              children: [
                {
                  type: "svg",
                  props: {
                    width: "56",
                    height: "56",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    style: { marginRight: "16px" },
                    children: [
                      {
                        type: "path",
                        props: {
                          d: "M4 18V6",
                          stroke: colors.primary,
                          strokeWidth: "1.5",
                          strokeLinecap: "round",
                        },
                      },
                      {
                        type: "path",
                        props: {
                          d: "M20 6V18",
                          stroke: colors.primary,
                          strokeWidth: "1.5",
                          strokeLinecap: "round",
                        },
                      },
                      {
                        type: "path",
                        props: {
                          d: "M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z",
                          stroke: colors.primary,
                          strokeWidth: "1.5",
                        },
                      },
                      {
                        type: "path",
                        props: {
                          d: "M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12",
                          stroke: colors.primary,
                          strokeWidth: "1.5",
                          opacity: "0.5",
                        },
                      },
                      {
                        type: "path",
                        props: {
                          d: "M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18",
                          stroke: colors.primary,
                          strokeWidth: "1.5",
                        },
                      },
                    ],
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "64px",
                      fontWeight: 600,
                      color: colors.primary,
                      letterSpacing: "-0.02em",
                    },
                    children: "SQL",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "64px",
                      fontWeight: 600,
                      color: colors.muted,
                      letterSpacing: "-0.02em",
                    },
                    children: "4",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "64px",
                      fontWeight: 600,
                      color: colors.foreground,
                      letterSpacing: "-0.02em",
                    },
                    children: "All",
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: "24px",
                color: colors.muted,
                letterSpacing: "-0.01em",
              },
              children: "Interactive SQL learning platform",
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "40px",
                fontSize: "16px",
                color: colors.primary,
                letterSpacing: "0.02em",
              },
              children: "sql4all.org",
            },
          },
        ],
      },
    } as any,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Inter",
          data: interData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interSemiboldData,
          weight: 600,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });

  const png = resvg.render().asPng();
  const outputPath = join(process.cwd(), "public/og.png");
  writeFileSync(outputPath, png);

  console.log(`✓ OG image generated: ${outputPath}`);
}

async function generateFavicon() {
  const size = 32;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        },
        children: {
          type: "svg",
          props: {
            width: "28",
            height: "28",
            viewBox: "0 0 24 24",
            fill: "none",
            children: [
              {
                type: "path",
                props: {
                  d: "M4 18V6",
                  stroke: colors.primary,
                  strokeWidth: "2",
                  strokeLinecap: "round",
                },
              },
              {
                type: "path",
                props: {
                  d: "M20 6V18",
                  stroke: colors.primary,
                  strokeWidth: "2",
                  strokeLinecap: "round",
                },
              },
              {
                type: "path",
                props: {
                  d: "M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z",
                  stroke: colors.primary,
                  strokeWidth: "2",
                },
              },
              {
                type: "path",
                props: {
                  d: "M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12",
                  stroke: colors.primary,
                  strokeWidth: "2",
                  opacity: "0.6",
                },
              },
              {
                type: "path",
                props: {
                  d: "M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18",
                  stroke: colors.primary,
                  strokeWidth: "2",
                },
              },
            ],
          },
        },
      },
    } as any,
    {
      width: size,
      height: size,
      fonts: [],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    background: "rgba(0,0,0,0)",
  });

  const png = resvg.render().asPng();
  const outputPath = join(process.cwd(), "public/favicon.png");
  writeFileSync(outputPath, png);

  console.log(`✓ Favicon generated: ${outputPath}`);
}

async function main() {
  await generateOG();
  await generateFavicon();
}

main().catch(console.error);
