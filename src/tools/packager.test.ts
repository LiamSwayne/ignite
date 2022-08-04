import { cmdChunkReducer, list } from "./packager"

describe("packager", () => {
  describe("outputReducer", () => {
    describe("npm", () => {
      it("should be defined", () => {
        expect(cmdChunkReducer.npm).toBeDefined()
      })

      it("should reduce single command chunk", () => {
        const cmdOutputChunks = [
          `
          {
            "resolved": "file:../../Roaming/fnm/node-versions/v16.16.0/installation",
            "dependencies": {
              "corepack": {
                "version": "0.10.0"
              },
              "expo-cli": {
                "version": "6.0.1"
              },
              "npm": {
                "version": "8.11.0"
              }
            }
          }
          `,
        ]

        expect(cmdChunkReducer.npm(cmdOutputChunks)).toEqual(cmdOutputChunks[0])
      })

      it("should reduce command chunks with warnings", () => {
        const cmdOutputChunks = [
          `npm WARN config global \`--global\`, \`--local\` are deprecated. Use \`--location=global\` instead.`,
          `npm WARN config global \`--global\`, \`--local\` are deprecated. Use \`--location=global\` instead.`,
          `
            {
              "resolved": "file:../../Roaming/fnm/node-versions/v16.16.0/installation",
              "dependencies": {
                "corepack": {
                    "version": "0.10.0"
                },
                "expo-cli": {
                    "version": "6.0.1"
                },
                "npm": {
                    "version": "8.11.0"
                }
              }
            }
          `,
        ]

        expect(cmdChunkReducer.npm(cmdOutputChunks)).toEqual(cmdOutputChunks[2])
      })
    })
  })

  describe("list", () => {
    it("should be defined", () => {
      expect(list).toBeDefined()
    })

    it("should return a command and parser", () => {
      const [cmd, parser] = list()
      expect(cmd).toBeDefined()
      expect(parser).toBeDefined()
    })

    describe("npm", () => {
      it("should parse valid command output", () => {
        const [, parser] = list({ packagerName: "npm" })
        const cmdOutput = `
          {
            "resolved": "file:../../Roaming/fnm/node-versions/v16.16.0/installation",
            "dependencies": {
              "corepack": {
                "version": "0.10.0"
              },
              "expo-cli": {
                "version": "6.0.1"
              },
              "npm": {
                "version": "8.11.0"
              }
            }
          }
        `
        expect(parser(cmdOutput)).toEqual([
          ["corepack", "0.10.0"],
          ["expo-cli", "6.0.1"],
          ["npm", "8.11.0"],
        ])
      })
    })

    describe("yarn", () => {
      it("should parse valid command output", () => {
        const output: string = `
        yarn global v1.22.17
        info "detox-cli@19.0.0" has binaries:
           - detox
        Done in 0.16s.
        `
        const [, parser] = list({ packagerName: "yarn" })
        expect(parser(output)).toEqual([["detox-cli", "19.0.0"]])
      })
    })

    describe("pnpm", () => {
      it("should throw error", () => {
        expect(() => list({ packagerName: "pnpm" })).toThrow()
      })
    })
  })
})
