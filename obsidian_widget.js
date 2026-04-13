// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;

//=============================================================================
// 1. Constants & Configurations
//=============================================================================

// == File Bookmark Settings =============================================================
const BOOKMARKED_FOLDER_NAME = 'inbox'; // File bookmark name set in Scriptable
const FILE_NAME_RUNS_IN_APP = 'example'; // Default file name for in-app preview

// == Basic Display Settings =============================================================
const isPhone = true; // Specify the device (true: iPhone, false: iPad)
const USE_FULL_WIDTH_CHARS = false; // Set to true if using full-width characters like Japanese to adjust line wrapping.

const FONT_SIZE = 13; // Base font size
const LINE_SPACING = 2; // Spacing between lines
const PARTITION_STRING = '---'; // Content after this string will be ignored
const SHOW_FIRSTLINE_AS_PLAINTEXT = false; // Whether to display the first line without special styles
const SHOW_FILENAME_ON_FIRSTLINE = false; // Whether to show the file name on the top line
const SHOW_TASK_NUMBER = true; // Show total number of incomplete tasks
const USE_JAPANESE_TIME_FORMAT = false; // Use Japanese date format (e.g., "月" instead of "Mon")
const AUTO_SORT_BY_TIME = false; // Automatically sort tasks based on their start time

const DEBUG = false; // Enable border visualization for layout debugging

// == Color and Style Settings ========================================================
const DARK_BACKGROUND_COLOR = '1C1C1E00'; // Background color for Dark Mode
const LIGHT_BACKGROUND_COLOR = 'FFFFFF'; // Background color for Light Mode

// First line style
const FIRST_LINE_COLOR_LIGHT = '#0088FF';
const FIRST_LINE_COLOR_DARK = '#0091FF';
const FIRST_LINE_ALPHA = 'CC';
const FIRST_LINE_TASK_ALPHA = SHOW_TASK_NUMBER ? '80' : '00';

// URL / Link style
const URL_COLOR_LIGHT = '1C1C1E';
const URL_COLOR_DARK = 'F2F2F7';
const URL_ALPHA = '';

// Due date / Time tag opacity
const DUE_DATE_BACKGROUND_ALPHA = '2E';
const DUE_DATE_TEXT_ALPHA = 'F2';

const DUE_TIME_BACKGROUND_ALPHA = DEBUG ? '33' : '00';
const DUE_TIME_TEXT_ALPHA = 'F2';

// == Advanced Internal Settings =========================================================
const FRONTMATTER_STRING = '---'; // Delimiter for Obsidian YAML front matter
const BASE_FONT_SIZE = 13;
const SIZE_FACTOR = FONT_SIZE / BASE_FONT_SIZE;
const TAB_SPACE_SIZE = 14 * SIZE_FACTOR; // Indentation width per tab
const MAX_LINE_WIDTH_OFFSET = USE_FULL_WIDTH_CHARS && FONT_SIZE > 12 || !USE_FULL_WIDTH_CHARS && FONT_SIZE > 14 ? 0.3 : 0;
const MAX_LINE_WIDTH = isPhone ? getWidgetConfigByFamily().maxLineWidth_iPhone : getWidgetConfigByFamily().maxLineWidth_iPad;

// Global variables for state management
let LINE_COUNT = 0;
let H1_COUNT = 0;
let H2_COUNT = 0;
let H3_COUNT = 0;
let IS_TIME_BLOCKING_MODE = false; // Automatically set to true if any task has a time assigned
let SORTED_TIME_SLOTS = []; // Stores all task start times (in minutes) in ascending order

// Central style configuration object
const CONFIG = {
    h1:     { fontSizeScale: 1.3, color_light: Color.black(), color_dark: Color.white() },
    h2:     { fontSizeScale: 1.2, color_light: Color.black(), color_dark: Color.white() },
    h3:     { fontSizeScale: 1.1, color_light: Color.black(), color_dark: Color.white() },
    todo:   { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    bullet: { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    number: { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    text:   { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    message:{ fontSizeScale: 1,   color_light: Color.lightGray(), color_dark: Color.darkGray() },
    bold:   { fontSizeScale: 1 },
    italic: { fontSizeScale: 1 },
    url:    {
        color_light: new Color(`${URL_COLOR_LIGHT}${URL_ALPHA}`),
        color_dark: new Color(`${URL_COLOR_DARK}${URL_ALPHA}`)
    },
    firstLineText: {
        fontSizeScale: 1.3,
        color_light: new Color(`${FIRST_LINE_COLOR_LIGHT}${FIRST_LINE_ALPHA}`),
        color_dark: new Color(`${FIRST_LINE_COLOR_DARK}${FIRST_LINE_ALPHA}`)
    },
    // Style for the "Unscheduled" heading (tasks without time)
    unscheduledHeading: {
      fontSizeScale: 1.1,
      bold: true,
      color_light: new Color('#AEAEB2'),
      color_dark: new Color('#636366'),
      topSpacing: 6,
      bottomSpacing: 0,
    },
    // Image/Icon styles
    todoImage: {
        topPadding: 0.7, bottomPadding: 0, rightMargin: 2, leftMargin: 0, imageSizeScale: 1.1,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    bulletImage: {
        topPadding: 2 * SIZE_FACTOR, bottomPadding: 0, rightMargin: 0, leftMargin: 0, imageSizeScale: 1,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    numberImage: {
        topPadding: 0, bottomPadding: 0, rightMargin: 0, leftMargin: 0,
        spacing: 0.3, imageSizeScale: 0.7,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    dotImage: {
        topPadding: 0.6, bottomPadding: 0, rightMargin: 1, leftMargin: 0.7, imageSizeScale: 0.9,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    reloadIconImage: {
        topPadding: 0, bottomPadding: 0, rightMargin: 0, leftMargin: 0, imageSizeScale: 1,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    taskNum: {
        topPadding: 2, bottomPadding: 0, rightMargin: 0, leftMargin: 0,
        spacing: 0.3, leftSpacing: 3, imageSizeScale: 0.7,
        color_light: new Color(`${FIRST_LINE_COLOR_LIGHT}${FIRST_LINE_TASK_ALPHA}`),
        color_dark: new Color(`${FIRST_LINE_COLOR_DARK}${FIRST_LINE_TASK_ALPHA}`),
    },
    // Date/Time tag styles based on status
    dueDateTime:  {
        topPadding: 0, bottomPadding: 0, rightMargin: 0, leftMargin: 0, textFontSize: FONT_SIZE * 0.85,
        cornerRadius: 4, borderWidth: 0,
        earlier: {
            textColor_light: new Color(`#FF383C${DUE_DATE_TEXT_ALPHA}`),
            textColor_dark: new Color(`#FF4245${DUE_DATE_TEXT_ALPHA}`),
            backgroundColor_light: new Color(`#FF383C${DUE_DATE_BACKGROUND_ALPHA}`),
            backgroundColor_dark: new Color(`#FF4245${DUE_DATE_BACKGROUND_ALPHA}`)
        },
        today: {
            textColor_light: new Color(`#0088FF${DUE_DATE_TEXT_ALPHA}`),
            textColor_dark: new Color(`#0091FF${DUE_DATE_TEXT_ALPHA}`),
            backgroundColor_light: new Color(`#0088FF${DUE_DATE_BACKGROUND_ALPHA}`),
            backgroundColor_dark: new Color(`#0091FF${DUE_DATE_BACKGROUND_ALPHA}`)
        },
        tomorrow: {
            textColor_light: new Color(`#0088FF${DUE_DATE_TEXT_ALPHA}`),
            textColor_dark: new Color(`#0091FF${DUE_DATE_TEXT_ALPHA}`),
            backgroundColor_light: new Color(`#0088FF${DUE_DATE_BACKGROUND_ALPHA}`),
            backgroundColor_dark: new Color(`#0091FF${DUE_DATE_BACKGROUND_ALPHA}`)
        },
        nextSevenDays: {
            textColor_light: new Color(`#8E8E93${DUE_DATE_TEXT_ALPHA}`),
            textColor_dark: new Color(`#8E8E93${DUE_DATE_TEXT_ALPHA}`),
            backgroundColor_light: new Color(`#8E8E93${DUE_DATE_BACKGROUND_ALPHA}`),
            backgroundColor_dark: new Color(`#8E8E93${DUE_DATE_BACKGROUND_ALPHA}`)
        },
        later: {
            textColor_light: new Color(`#AEAEB2${DUE_TIME_TEXT_ALPHA}`),
            textColor_dark: new Color(`#636366${DUE_TIME_TEXT_ALPHA}`),
            backgroundColor_light: new Color(`#AEAEB2${DUE_DATE_BACKGROUND_ALPHA}`),
            backgroundColor_dark: new Color(`#636366${DUE_DATE_BACKGROUND_ALPHA}`)
        },
        // Time blocking statuses
        timeCurrent: {  // Ongoing tasks -> Blue
            textColor_light: new Color(`#0088FF${DUE_TIME_TEXT_ALPHA}`),
            textColor_dark: new Color(`#0091FF${DUE_TIME_TEXT_ALPHA}`),
            backgroundColor_light: new Color(`#0088FF${DUE_TIME_BACKGROUND_ALPHA}`),
            backgroundColor_dark: new Color(`#0091FF${DUE_TIME_BACKGROUND_ALPHA}`)
        },
        timePast: {  // Finished tasks -> Dark gray
            textColor_light: new Color(`#C7C7CC${DUE_TIME_TEXT_ALPHA}`),
            textColor_dark: new Color(`#48484A${DUE_TIME_TEXT_ALPHA}`),
            backgroundColor_light: new Color(`#C7C7CC${DUE_TIME_BACKGROUND_ALPHA}`),
            backgroundColor_dark: new Color(`#48484A${DUE_TIME_BACKGROUND_ALPHA}`)
        },
        timeFuture: {  // Not started -> Light gray
            textColor_light: new Color(`#8E8E93${DUE_TIME_TEXT_ALPHA}`),
            textColor_dark: new Color(`#8E8E93${DUE_TIME_TEXT_ALPHA}`),
            backgroundColor_light: new Color(`#8E8E93${DUE_TIME_BACKGROUND_ALPHA}`),
            backgroundColor_dark: new Color(`#8E8E93${DUE_TIME_BACKGROUND_ALPHA}`)
        },
    }
};

/**
 * @summary Returns widget settings based on size.
 * @returns {object} Layout parameters for small/medium/large.
 */
function getWidgetConfigByFamily() {
    switch (config.widgetFamily) {
        case 'small':
            return {
                lineLimit_iPhone: () => Math.floor((135 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                lineLimit_iPad:   () => Math.floor((95 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPhone: -3.066 * FONT_SIZE + 0.0644 * FONT_SIZE * FONT_SIZE + 49.423 - MAX_LINE_WIDTH_OFFSET,
                maxLineWidth_iPad:   -4.411 * FONT_SIZE + 0.125  * FONT_SIZE * FONT_SIZE + 51.441,
                fullWidthCharSize: 1.85
            };
        case 'medium':
            return {
                lineLimit_iPhone: () => Math.floor((135 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                lineLimit_iPad:   () => Math.floor((95 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPhone: -9.44  * FONT_SIZE + 0.2348 * FONT_SIZE * FONT_SIZE + 132.354 - MAX_LINE_WIDTH_OFFSET,
                maxLineWidth_iPad:   -8.919 * FONT_SIZE + 0.223  * FONT_SIZE * FONT_SIZE + 120.832,
                fullWidthCharSize: 2
            };
        case 'large':
            return {
                lineLimit_iPhone: () => Math.floor((297 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                lineLimit_iPad:   () => Math.floor((263 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPhone: -9.44  * FONT_SIZE + 0.2348 * FONT_SIZE * FONT_SIZE + 132.354 - MAX_LINE_WIDTH_OFFSET,
                maxLineWidth_iPad:   -8.919 * FONT_SIZE + 0.223  * FONT_SIZE * FONT_SIZE + 120.832,
                fullWidthCharSize: 2
            };
        case 'extraLarge':
            return {
                lineLimit_iPad:   () => Math.floor((263 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPad:   -16.264 * FONT_SIZE + 0.375 * FONT_SIZE * FONT_SIZE + 245.632,
                fullWidthCharSize: 2
            };
        default:
            return {
                lineLimit_iPhone: () => Math.floor((297 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                lineLimit_iPad:   () => Math.floor((263 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPhone: -9.44  * FONT_SIZE + 0.2348 * FONT_SIZE * FONT_SIZE + 132.354 - MAX_LINE_WIDTH_OFFSET,
                maxLineWidth_iPad:   -8.919 * FONT_SIZE + 0.223  * FONT_SIZE * FONT_SIZE + 120.832,
                fullWidthCharSize: 2
            };
    }
}

const LINE_LIMIT = isPhone ? getWidgetConfigByFamily().lineLimit_iPhone() : getWidgetConfigByFamily().lineLimit_iPad();

//=============================================================================
// 2. Obsidian Integration
//=============================================================================

const iCloud = FileManager.iCloud();
const noteName = config.runsInWidget ? args.widgetParameter : FILE_NAME_RUNS_IN_APP;

const vaultPath = iCloud.bookmarkedPath(BOOKMARKED_FOLDER_NAME);
const targetNoteName = `${noteName}.md`;
const targetNotePath = `${vaultPath}/${targetNoteName}`;

const targetNoteUrl = `obsidian://open?vault=${encodeURIComponent(BOOKMARKED_FOLDER_NAME)}&file=${encodeURIComponent(noteName)}`;

//=============================================================================
// 3. Main Execution
//=============================================================================

(async () => {
    // Check if widget parameter is set
    if (!args.widgetParameter && config.runsInWidget) {
        const message = ['Widget parameter is not set.', 'Please enter the filename in the Parameter of the widget settings.'];
        const errorWidget = handleError(message);
        Script.setWidget(errorWidget);
        return;
    }

    // Check if note exists
    if (!iCloud.fileExists(targetNotePath)) {
        const message = [`Note not found:`, `${targetNoteName}`];
        const errorWidget = handleError(message);
        Script.setWidget(errorWidget);
        return;
    }

    const noteContent = iCloud.readString(targetNotePath);
    let { memos, isTextExist, numberOfTasks } = extractMemoData(noteContent);

    // Pre-processing: Build time slots and sort automatically
    const preprocessed = preprocessMemos(memos);
    memos = preprocessed.sortedMemos;
    SORTED_TIME_SLOTS = preprocessed.timeSlots;

    let widget;
    if (!isTextExist) {
        const message = SHOW_TASK_NUMBER ? 'All tasks complete!' : 'Text not found.';
        widget = handleNoText(message);
    } else {
        widget = createWidget(memos, targetNoteUrl, numberOfTasks);
    }

    if (config.runsInWidget) {
        Script.setWidget(widget);
    } else {
        widget.presentLarge();
    }

    Script.complete();
})();


//=============================================================================
// 4. Function Definitions
//=============================================================================

// 4-1. Main Widget Creation Functions
//-----------------------------------------------------------------------------

/**
 * @summary Main function to build the widget UI.
 * @param {string[]} memos - Preprocessed note lines.
 * @param {string} noteUrl - Obsidian URL.
 * @param {number} numberOfTasks - Incomplete task count.
 * @returns {ListWidget}
 */
function createWidget(memos, noteUrl, numberOfTasks) {
  const widget = new ListWidget();
  widget.setPadding(15, 13.5, 15, 11);
  widget.url = noteUrl;
  widget.backgroundColor = Color.dynamic(new Color(LIGHT_BACKGROUND_COLOR), new Color(DARK_BACKGROUND_COLOR));

  const mainStack = widget.addStack();
  mainStack.layoutVertically();
  mainStack.spacing = LINE_SPACING;

  let isFirstLine = true;
  let isInUnscheduledSection = false;
  let isParentTimed = false;
  
  let currentLineLimit = LINE_LIMIT;

  if (SORTED_TIME_SLOTS.length > 0) {
      currentLineLimit -= 1;
  }

  for (const memo of memos) {
      LINE_COUNT++;
      if (LINE_COUNT > currentLineLimit) {
          break;
      }

      // Detection of Unscheduled section heading
      const isUnscheduledHeading = (memo === '### Unscheduled');
      if (isUnscheduledHeading) {
          isInUnscheduledSection = true;
      }

      const { type, replacedText, indentLevel, number_str, hasDateTime, dueDate, time } = parseMemoLine(memo);
      if (time) { IS_TIME_BLOCKING_MODE = true }
      if (type[0] === 'h1') H1_COUNT++;
      else if (type[0] === 'h2') H2_COUNT++;
      else if (type[0] === 'h3') H3_COUNT++;

      // Spacing for Unscheduled heading
      if (isUnscheduledHeading) {
          mainStack.addSpacer(CONFIG.unscheduledHeading.topSpacing);
      }

      if (indentLevel === 0) {
          isParentTimed = !!time; 
      }

      addLineToWidget(mainStack, type, replacedText, indentLevel, number_str, isFirstLine, numberOfTasks, hasDateTime, dueDate, time, isInUnscheduledSection, isUnscheduledHeading, isParentTimed);

      if (isUnscheduledHeading) {
          mainStack.addSpacer(CONFIG.unscheduledHeading.bottomSpacing);
      }

      isFirstLine = false;
  }

  widget.addSpacer();
  return widget;
}

function handleError(message) {
    const widget = new ListWidget();
    for (let line of message) {
        const widgetText = widget.addText(line);
        widgetText.centerAlignText();
        widgetText.textColor = Color.dynamic(CONFIG.text.color_light, CONFIG.text.color_dark);
    }
    return widget;
}

function handleNoText(message) {
    const widget = new ListWidget();
    widget.url = targetNoteUrl;
    const mainStack = widget.addStack();
    mainStack.layoutVertically();

    const reloadIconStack = mainStack.addStack();
    reloadIconStack.layoutHorizontally();
    reloadIconStack.addSpacer();
    addReloadIcon(reloadIconStack, CONFIG.reloadIconImage);
    mainStack.addSpacer();

    const textStack = mainStack.addStack();
    textStack.addSpacer();
    const textElement = textStack.addText(message);
    textElement.textColor = Color.dynamic(CONFIG.message.color_light, CONFIG.message.color_dark);
    textStack.addSpacer();

    mainStack.addSpacer();
    return widget;
}


// 4-2. Data Processing & Text Parsing Functions
//-----------------------------------------------------------------------------

/**
 * @summary Extracts valid lines from raw markdown string.
 * @param {string} noteString - Raw markdown content.
 */
function extractMemoData(noteString) {
    const lines = noteString.split('\n');
    let sliceIndex = 0;

    // Remove YAML front matter
    if (lines[0] === FRONTMATTER_STRING) {
        lines.shift();
        sliceIndex = lines.indexOf(FRONTMATTER_STRING) + 1;
    }

    const contentLines = lines.slice(sliceIndex);

    // Filter by partition delimiter
    const partitionIndex = contentLines.indexOf(PARTITION_STRING);
    const relevantLines = partitionIndex === -1 ? contentLines : contentLines.slice(0, partitionIndex);

    // Hide completed tasks
    let filteredLines = relevantLines.filter(line => !line.includes("- [x]"));

    if (SHOW_TASK_NUMBER) {
        filteredLines = filteredLines.filter(line => {
            const startsWithTab = /^\t+/.test(line);
            const isTask = line.includes("- [ ]");
            // Exclude indented non-task lines if SHOW_TASK_NUMBER is on
            if (startsWithTab && !isTask) {
                return false;
            }
            return true;
        });
    }

    const numberOfTasks = filteredLines.filter(item => item.includes("- [ ] ")).length;

    if (SHOW_FILENAME_ON_FIRSTLINE) {
        filteredLines.unshift(noteName);
    }

    // Remove empty headings or trailing blank lines
    let headingIndex = -1;
    let blankArray = [];
    let removeIndices = new Set();

    for (let i = 1; i <= filteredLines.length; i++) {
        const isHeading = i < filteredLines.length &&
            (/^#+/.test(filteredLines[i]) || /^\*\*.+\*\*$/.test(filteredLines[i]));
        const isEnd = i === filteredLines.length;

        if (isHeading || isEnd) {
            if (headingIndex !== -1) {
                if (i === headingIndex + 1) {
                    removeIndices.add(headingIndex);
                } else if (blankArray.length && blankArray.every(v => v)) {
                    for (let j = headingIndex; j < i; j++) {
                        removeIndices.add(j);
                    }
                }
            }
            blankArray = [];
            headingIndex = i;
        } else {
            if (headingIndex !== -1) {
                !filteredLines[i] ? blankArray.push(true) : blankArray.push(false);
            }
        }
    }

    filteredLines = filteredLines.filter((_, index) => !removeIndices.has(index));

    let isTextExist = SHOW_FILENAME_ON_FIRSTLINE ? filteredLines.slice(2).some(item => item != "") : filteredLines.slice(1).some(item => item != "");

    if (filteredLines.every(line => line.trim() === '')) {
        isTextExist = false;
    }

    return { memos: filteredLines, isTextExist, numberOfTasks };
}

/**
 * @summary Groups tasks and sorts them by time.
 * @description Links indented sub-tasks to their parent task and groups them. 
 *              Tasks without time are moved to the "Unscheduled" section.
 * @param {string[]} memos - Array of note lines.
 * @returns {{ sortedMemos: string[], timeSlots: number[] }}
 */
function preprocessMemos(memos) {
  if (memos.length <= 1) return { sortedMemos: memos, timeSlots: [] };

  const firstLine = memos[0];
  const rest = memos.slice(1);

  // --- Group Building ---
  const groups = [];
  let i = 0;

  while (i < rest.length) {
      const line = rest[i];

      if (line.trim() === '') {
          groups.push({ lines: [line], minutes: null, isEmpty: true });
          i++;
          continue;
      }

      const isIndented = /^\t+/.test(line);

      if (!isIndented) {
          const group = { lines: [line], minutes: null, isEmpty: false };

          // Get time from parent task
          const { time } = parseMemoLine(line);
          if (time) {
              const t = parseTime(time);
              if (t) {
                  group.minutes = t.hours * 60 + t.minutes;
              }
          }

          // Collect indented sub-tasks
          let j = i + 1;
          while (j < rest.length && /^\t+/.test(rest[j])) {
              group.lines.push(rest[j]);
              j++;
          }

          groups.push(group);
          i = j;
      } else {
          // Rare case: indented line without parent
          groups.push({ lines: [line], minutes: null, isEmpty: false });
          i++;
      }
  }

  // --- Sorting by Time ---
  const timed = [];
  const untimed = [];
  const allTimesSet = new Set();

  for (const group of groups) {
      if (group.minutes !== null) {
          timed.push(group);
          allTimesSet.add(group.minutes);
      } else {
          untimed.push(group);
      }
  }

  const timeSlots = [...allTimesSet].sort((a, b) => a - b);

  if (AUTO_SORT_BY_TIME && timed.length > 0) {
      timed.sort((a, b) => a.minutes - b.minutes);

      const sortedLines = [firstLine];
      for (const group of timed) {
          sortedLines.push(...group.lines);
      }

      const untimedFiltered = untimed.filter(group => {
        if (group.isEmpty) return true;
        const isHeading = /^#{1,3}\s/.test(group.lines[0].trim());
        return !isHeading;
    });

      // Cleanup blank lines in unscheduled part
      while (untimedFiltered.length > 0 && untimedFiltered[0].isEmpty) untimedFiltered.shift();
      while (untimedFiltered.length > 0 && untimedFiltered[untimedFiltered.length - 1].isEmpty) untimedFiltered.pop();

      const hasContent = untimedFiltered.some(g => !g.isEmpty && g.lines.some(l => l.trim() !== ''));

      if (hasContent) {
          sortedLines.push('### Unscheduled');
          for (const group of untimedFiltered) {
              sortedLines.push(...group.lines);
          }
      }

      return { sortedMemos: sortedLines, timeSlots };
  }

  return { sortedMemos: memos, timeSlots };
}

/**
 * @summary Parses a single line to determine its formatting and data.
 * @param {string} memoLine - The line string.
 */
function parseMemoLine(memoLine) {
    const regexTab = /^\t+/;
    const regexHeading = /^(#+) /;
    const regexTodo = /^- \[ \] /;
    const regexBullet = /^(?:-|\*)\s/;
    const regexNumber = /^\d+\.\s/;

    const indentLevel = (memoLine.match(regexTab) || [''])[0].length;
    const textWithoutIndent = memoLine.replace(regexTab, '');

    let type = [];
    let replacedText = [];
    let number_str = '0';
    let hasDateTime = false;
    let dueDate = '';
    let time = '';

    // Determine line type (h1-3, todo, bullet, etc.)
    if (regexHeading.test(textWithoutIndent)) {
        const headingPrefix = textWithoutIndent.match(regexHeading)[0];
        type.push(`h${headingPrefix.length - 1}`);
        replacedText.push(textWithoutIndent.replace(headingPrefix, ''));
    } else if (regexTodo.test(textWithoutIndent)) {
        type.push('todo');
        replacedText.push(textWithoutIndent.replace(regexTodo, ''));
    } else if (regexBullet.test(textWithoutIndent)) {
        type.push('bullet');
        replacedText.push(textWithoutIndent.replace(regexBullet, ''));
    } else if (regexNumber.test(textWithoutIndent)) {
        type.push('number');
        number_str = textWithoutIndent.match(regexNumber)[0].replace(/\.\s/, '');
        replacedText.push(textWithoutIndent.replace(regexNumber, ''));
    } else {
        type.push('text');
        replacedText.push(textWithoutIndent);
    }

    // Parse inline styles
    const regexInline = /\*\*(.*?)\*\*|(?<!\*)\*(?!\*)(.*?)\*(?!\*)|\[([^\]]+)\]\(([^)]+)\)|\[\[([^\]]+)\]\]|(https?:\/\/[^\s\]\)\}\>,]+)/g;
    if (regexInline.test(replacedText[0])) {
        type.push('inline');
        replacedText = splitWithMatches(replacedText[0]);
    }

    // Parse due date and time from end of string
    const lastIndex = replacedText.length - 1;
    const lastText = replacedText[lastIndex];
    const dateTimeMatch = extractDateTimeFromTask(lastText);

    dueDate = dateTimeMatch.dateStr;
    time = dateTimeMatch.timeStr;

    if ( dueDate || time ){
        hasDateTime = true;
        replacedText[lastIndex] = dateTimeMatch.taskName;
    }
    return { type, replacedText, indentLevel, number_str, hasDateTime, dueDate, time };
}

function splitWithMatches(str) {
    const regex = /\*\*(.*?)\*\*|(?<!\*)\*(?!\*)(.*?)\*(?!\*)|\[([^\]]+)\]\(([^)]+)\)|\[\[([^\]]+)\]\]|(https?:\/\/[^\s\]\)\}\>,]+)/g;
    const matches = [...str.matchAll(regex)];
    let lastIndex = 0;
    const result = [];

    for (const match of matches) {
        if (match.index > lastIndex) {
            result.push(str.slice(lastIndex, match.index));
        }
        result.push(match[0]);
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < str.length) {
        result.push(str.slice(lastIndex));
    }
    return result;
}

function getTypeOfInline(string) {
    const boldMatch = string.match(/^\*\*(.*?)\*\*$/);
    const italicMatch = string.match(/^\*(.*?)\*$/);
    const urlMatch = string.match(/\[([^\]]+)\]\(([^)]+)\)|\[\[([^\]]+)\]\]|(https?:\/\/[^\s\]\)\}\>,]+)/);

    if (boldMatch) {
        return { textType: "bold", text: boldMatch[1], url: '' };
    }
    if (italicMatch) {
        return { textType: "italic", text: italicMatch[1], url: '' };
    }
    if (urlMatch) {
        if (urlMatch[1] && urlMatch[2]) {
            return { textType: "url", text: urlMatch[1], url: urlMatch[2] };
        }
        if (urlMatch[3]) {
            const file = encodeURIComponent(urlMatch[3]);
            const vault = encodeURIComponent(bookmarkedFolderName);
            return { textType: "url", text: urlMatch[3], url: `obsidian://open?vault=${vault}&file=${file}` };
        }
        if (urlMatch[4]) {
            return { textType: "url", text: urlMatch[4], url: urlMatch[4] };
        }
    }
    return { textType: "text", text: string, url: '' };
}


// 4-3. UI Element Rendering Helper Functions
//-----------------------------------------------------------------------------

/**
 * @summary Adds a single line stack (time + markers + text) to the widget.
 */
function addLineToWidget(mainStack, type, replacedText, indentLevel, number_str, isFirstLine, numberOfTasks, hasDateTime, dueDate, time, isInUnscheduledSection, isUnscheduledHeading, isParentTimed) {
  const lineStack = mainStack.addStack();
  lineStack.layoutHorizontally();
  if(DEBUG){lineStack.borderWidth=1}

  // Add time tag if it exists
  if (time) {
      addDueTime(lineStack, time, CONFIG.dueDateTime);
  }

  lineStack.addSpacer(indentLevel * TAB_SPACE_SIZE);

  let listMarkerWidth = 0;

  const needsSpacer = (AUTO_SORT_BY_TIME || (indentLevel > 0 && isParentTimed)) && IS_TIME_BLOCKING_MODE && !time && !isFirstLine && !['h1', 'h2', 'h3'].includes(type[0]) && !isInUnscheduledSection;
  // Offset alignment when Time Blocking is active but line has no time tag
  if (needsSpacer) {
      lineStack.addSpacer( 2 * FONT_SIZE + 8);
  }

  if (['todo', 'bullet', 'number'].includes(type[0])) {
      listMarkerWidth = 4;
      if(IS_TIME_BLOCKING_MODE){CONFIG.todoImage.imageSizeScale = 0.8}
      addListMarker(lineStack, CONFIG[`${type[0]}Image`], type[0], number_str );
      lineStack.addSpacer( 0.2 * FONT_SIZE - 1.4 );
  }

  const textContainerStack = lineStack.addStack();
  textContainerStack.layoutVertically();
  let currentLineStack = textContainerStack.addStack();
  currentLineStack.layoutHorizontally();
  let addedText = '';
  if(DEBUG){currentLineStack.borderWidth=1}

  for (const item of replacedText) {
      if (LINE_COUNT > (isPhone ? getWidgetConfigByFamily().lineLimit_iPhone() : getWidgetConfigByFamily().lineLimit_iPad())) break;

      const { textType, text, url } = getTypeOfInline(item);

      // Determine style based on heading level or first-line setting
      const textFontSize = isUnscheduledHeading
          ? FONT_SIZE * CONFIG.unscheduledHeading.fontSizeScale
          : isFirstLine && !SHOW_FIRSTLINE_AS_PLAINTEXT
              ? FONT_SIZE * CONFIG.firstLineText.fontSizeScale
              : FONT_SIZE * CONFIG[type[0]].fontSizeScale;

      const textColor = isUnscheduledHeading
          ? Color.dynamic(CONFIG.unscheduledHeading.color_light, CONFIG.unscheduledHeading.color_dark)
          : isFirstLine && !SHOW_FIRSTLINE_AS_PLAINTEXT
              ? Color.dynamic(CONFIG.firstLineText.color_light, CONFIG.firstLineText.color_dark)
              : Color.dynamic(CONFIG[type[0]].color_light, CONFIG[type[0]].color_dark);

      const isBold = isUnscheduledHeading
          ? CONFIG.unscheduledHeading.bold
          : (isFirstLine && !SHOW_FIRSTLINE_AS_PLAINTEXT) || ['h1', 'h2', 'h3'].includes(type[0]) || textType === 'bold';

      const urlColor = Color.dynamic(CONFIG.url.color_light, CONFIG.url.color_dark);
      const isItalic = textType === 'italic';
      const isURL = textType === 'url';
      const indentWidth = USE_FULL_WIDTH_CHARS ? 2 : 2;

      let offset = 0;
      if (IS_TIME_BLOCKING_MODE && !isInUnscheduledSection) {
          if (FONT_SIZE <= 11) offset = 3;
          else if (FONT_SIZE > 11 && FONT_SIZE <= 12) offset = 4;
          else if ( FONT_SIZE > 12 && FONT_SIZE <= 13) offset = 5;
          else if ( FONT_SIZE > 13 && FONT_SIZE <= 15) offset = 6;
          else if ( FONT_SIZE > 15) offset = 7;
      }

      const maxLineWidth = MAX_LINE_WIDTH - (indentLevel * indentWidth) - listMarkerWidth - offset;
      const fullWidthCharSize = getWidgetConfigByFamily().fullWidthCharSize;

      ({ addedText, singleLineStack: currentLineStack } = addMultilineStyledText(
          textContainerStack, currentLineStack, text, addedText, maxLineWidth, fullWidthCharSize,
          { isBold, isItalic, isURL, textFontSize, textColor, url, urlColor }, dueDate
      ));
      if(DEBUG){currentLineStack.borderWidth=1}
  }

  if (isFirstLine && numberOfTasks > 0) {
      lineStack.addSpacer(CONFIG.taskNum.leftSpacing);
      addNumberImage(lineStack, CONFIG.taskNum, 'taskNum', String(numberOfTasks));
  }

  lineStack.addSpacer();

  if (isFirstLine) {
      addReloadIcon(lineStack, CONFIG.reloadIconImage);
      lineStack.addSpacer(3);
      if (!SHOW_FIRSTLINE_AS_PLAINTEXT) {
          mainStack.addSpacer(3);
      }
  }

  // Add due date tag at the end of the line
  if (dueDate) {
      lineStack.addSpacer();
      addDuedate(lineStack, dueDate, CONFIG.dueDateTime);
  }
}

function addMultilineStyledText(parentStack, childStack, nextText, addedText, maxLineWidth, fullWidthCharSize, styles, dueDate ) {
    const addedTextWidth = sliceByDisplayWidth(addedText, maxLineWidth, fullWidthCharSize).width;
    const remainingWidth = maxLineWidth - addedTextWidth;
    const nextTextInfo = sliceByDisplayWidth(nextText, remainingWidth, fullWidthCharSize);

    if (!nextTextInfo.tail) {
        addStyledTextToStack(childStack, nextText, styles, dueDate );
        return {
            addedText: addedText + nextText,
            singleLineStack: childStack,
        };
    }

    addStyledTextToStack(childStack, nextTextInfo.head, styles, dueDate );
    if ( dueDate ){
        return {
            addedText: addedText + nextTextInfo.head,
            singleLineStack: childStack,
        };
    }

    LINE_COUNT++;

    const LINE_LIMIT = isPhone ? getWidgetConfigByFamily().lineLimit_iPhone() : getWidgetConfigByFamily().lineLimit_iPad();
    if (LINE_COUNT > LINE_LIMIT) {
        return { addedText: addedText + nextText, singleLineStack: childStack };
    }

    const newStack = parentStack.addStack();
    newStack.layoutHorizontally();
    return addMultilineStyledText(parentStack, newStack, nextTextInfo.tail, '', maxLineWidth, fullWidthCharSize, styles, dueDate);
}

function addStyledTextToStack(stack, text, styles, dueDate) {
    const { isBold, isItalic, isURL, textFontSize, textColor, url, urlColor } = styles;
    const textElement = stack.addText(text);

    if (isBold) {
        textElement.font = isItalic ? new Font('HelveticaNeue-BoldItalic', textFontSize) : Font.boldSystemFont(textFontSize);
    } else if (isItalic) {
        textElement.font = Font.italicSystemFont(textFontSize);
    } else {
        textElement.font = Font.regularSystemFont(textFontSize);
    }

    if (isURL) {
        textElement.textColor = urlColor;
        textElement.url = url;
    } else {
        textElement.textColor = textColor;
    }

    if ( dueDate ) {
        textElement.lineLimit = 1;
    }
}

function sliceByDisplayWidth(str, maxWidth, fullWidthCharSize) {
    let width = 0;
    let cutIndex = 0;
    for (const [i, char] of Array.from(str).entries()) {
        const charWidth = char.match(/[^\x01-\x7E]/) ? fullWidthCharSize : 1;
        if (width + charWidth > maxWidth) break;
        width += charWidth;
        cutIndex = i + 1;
    }
    const head = str.slice(0, cutIndex);
    const tail = cutIndex < [...str].length ? str.slice(cutIndex) : null;
    return { head, tail, width };
}

// 4-4. Image & Icon Rendering Helper Functions
//-----------------------------------------------------------------------------

function addListMarker(stack, config, type, listNumber ) {
    switch (type) {
        case 'todo':
            const todoImage = SFSymbol.named('circle').image;
            addImage(stack, todoImage, config);
            break;
        case 'bullet':
            const bulletImage = storeImage('bullet-point.png');
            if (bulletImage) addImage(stack, bulletImage, config);
            break;
        case 'number':
            addNumberImage(stack, config, type, listNumber);
            break;
    }
}

function addNumberImage(stack, config, type, numberStr) {
    stack.addSpacer(2);
    const numberImageStack = stack.addStack();
    numberImageStack.spacing = config.spacing;
    numberImageStack.setPadding(config.topPadding, 0, config.bottomPadding, 0)

    for (const char of numberStr.split('')) {
        const image = storeImage(`${char}.png`);
        if (image) addImage(numberImageStack, image, config);
    }

    if (type === 'number') {
        const dotImage = storeImage('dot.png');
        if (dotImage) addImage(numberImageStack, image, CONFIG.dotImage);
    }
}

function addReloadIcon(stack, config) {
    const image = SFSymbol.named('arrow.clockwise').image;
    const imageElement = addImage(stack, image, config);
    imageElement.url = URLScheme.forRunningScript();
}

function addImage(stack, image, config) {
    const { topPadding, bottomPadding, rightMargin, leftMargin, imageSizeScale, color_light, color_dark } = config;

    stack.addSpacer(leftMargin);
    const imageContainer = stack.addStack();
    imageContainer.size = new Size(0, FONT_SIZE + 2.5)
    imageContainer.layoutVertically();
    imageContainer.addSpacer(topPadding);
    if(DEBUG){imageContainer.borderWidth=1}

    const imageRatio = image.size.width / image.size.height;
    const imageHeight = FONT_SIZE * imageSizeScale;
    const imageWidth = imageHeight * imageRatio;
    const imageSize = new Size(imageWidth, imageHeight);

    const imageElement = imageContainer.addImage(image);
    imageElement.imageSize = imageSize;
    imageElement.tintColor = Color.dynamic(color_light, color_dark);

    imageContainer.addSpacer(bottomPadding);
    stack.addSpacer(rightMargin);
    return imageElement;
}

/**
 * @summary Extracts date/time patterns from a task string.
 * @param {string} taskText - String like "Buy milk 04/13 13:00".
 */
function extractDateTimeFromTask(taskText) {
    const trimmed = taskText.trimEnd();

    const datePatterns = [
        '\\d{6}', // YYMMDD
        '\\d{2}[-\\/]\\d{1,2}[-\\/]\\d{1,2}', // YY-MM-DD, YY/MM/DD
        '\\d{1,2}[-\\/]\\d{1,2}', // MM-DD, MM/DD
    ];
    const dateGroup = `(${datePatterns.join('|')})`;
    const timeGroup = '(\\d{1,2}:\\d{2}|\\d{3,4})'; // 13:00, 1300, 9:30, 930

    const regex1 = new RegExp(`\\s${dateGroup}\\s${timeGroup}$`);
    let match = trimmed.match(regex1);
    if (match) {
        const dateStr = match[1];
        const timeStr = match[2];
        if (parseDueDate(dateStr) && parseTime(timeStr)) {
            return { taskName: trimmed.slice(0, match.index), dateStr, timeStr };
        }
    }

    const regex2 = new RegExp(`\\s${dateGroup}$`);
    match = trimmed.match(regex2);
    if (match) {
        const dateStr = match[1];
        if (parseDueDate(dateStr)) {
            return { taskName: trimmed.slice(0, match.index), dateStr, timeStr: null };
        }
    }

    const regex3 = new RegExp(`\\s${timeGroup}$`);
    match = trimmed.match(regex3);
    if (match) {
        const timeStr = match[1];
        if (parseTime(timeStr)) {
            return { taskName: trimmed.slice(0, match.index), dateStr: null, timeStr };
        }
    }

    return { taskName: trimmed, dateStr: null, timeStr: null };
}

/**
 * @summary Renders a due date badge.
 */
function addDuedate(stack, dueDate, config) {
    const { leftMargin, rightMargin, textFontSize, cornerRadius, borderWidth } = config;

    const dueDateStatus = getDueDateStatus(dueDate);
    const colorConfig = config[dueDateStatus];

    const displayDate = formatDueDate(dueDate);
    stack.addSpacer(leftMargin);

    const dateContainer = stack.addStack();
    dateContainer.layoutHorizontally();
    dateContainer.centerAlignContent();
    dateContainer.cornerRadius = cornerRadius;
    dateContainer.borderWidth = borderWidth;
    dateContainer.backgroundColor = Color.dynamic(
        colorConfig.backgroundColor_light,
        colorConfig.backgroundColor_dark
    );

    const vPadding = Math.max(0, (FONT_SIZE - textFontSize) * 0.6);
    const hPadding = FONT_SIZE * 0.25;

    dateContainer.setPadding(vPadding, hPadding, vPadding, hPadding);

    const textElement = dateContainer.addText(displayDate);
    textElement.font = Font.mediumSystemFont(textFontSize);
    textElement.textColor = Color.dynamic(
        colorConfig.textColor_light,
        colorConfig.textColor_dark
    );

    stack.addSpacer(rightMargin);
    return textElement;
}

/**
 * @summary Renders a time tag badge.
 */
function addDueTime(stack, timeStr, config) {
    const { leftMargin, rightMargin, textFontSize, cornerRadius, borderWidth } = config;

    const timeStatus = getTimeBlockStatus(timeStr);
    const colorConfig = config[timeStatus];

    const displayTime = formatTime(timeStr);
    stack.addSpacer(leftMargin);

    const timeContainer = stack.addStack();
    timeContainer.size = new Size( 2 * FONT_SIZE + 8 ,0)
    timeContainer.layoutHorizontally();
    timeContainer.centerAlignContent();
    timeContainer.cornerRadius = cornerRadius;
    timeContainer.borderWidth = borderWidth;
    timeContainer.backgroundColor = Color.dynamic(
        colorConfig.backgroundColor_light,
        colorConfig.backgroundColor_dark
    );

    const vPadding = Math.max(0, (FONT_SIZE - textFontSize) * 0.6);
    const hPadding = FONT_SIZE * 0;

    timeContainer.setPadding(vPadding, hPadding, vPadding, hPadding);

    const textElement = timeContainer.addText(displayTime);
    textElement.font = Font.mediumSystemFont(textFontSize);
    textElement.textColor = Color.dynamic(
        colorConfig.textColor_light,
        colorConfig.textColor_dark
    );

    stack.addSpacer(rightMargin);
    return textElement;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * @summary Formats raw date string to human-readable text.
 */
function formatDueDate(dueDate) {
    const parsedDate = parseDueDate(dueDate);
    if (!parsedDate) return dueDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((parsedDate - today) / (1000 * 60 * 60 * 24));
    const currentYear = today.getFullYear();
    const targetYear = parsedDate.getFullYear();

    if (diffDays === -1) return USE_JAPANESE_TIME_FORMAT ? '昨日' : 'Yesterday';
    if (diffDays === 0)  return USE_JAPANESE_TIME_FORMAT ? '今日' : 'Today';
    if (diffDays === 1)  return USE_JAPANESE_TIME_FORMAT ? '明日' : 'Tomorrow';

    if (diffDays >= 2 && diffDays <= 7) {
        const dayOfWeek = parsedDate.getDay();
        if (USE_JAPANESE_TIME_FORMAT) {
            return ['日','月','火','水','木','金','土'][dayOfWeek];
        } else {
            return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayOfWeek];
        }
    }

    if (targetYear !== currentYear) {
        const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const d = String(parsedDate.getDate()).padStart(2, '0');
        return `${targetYear}/${m}/${d}`;
    }

    const month = parsedDate.getMonth() + 1;
    const day   = parsedDate.getDate();
    if (USE_JAPANESE_TIME_FORMAT) {
        return `${month}月${day}日`;
    } else {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${months[parsedDate.getMonth()]} ${day}`;
    }
}

/**
 * @summary Determines chronological status for color coding.
 */
function getDueDateStatus(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow     = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const oneWeekLater = new Date(today); oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    const parsedDate = parseDueDate(dueDate);
    if (!parsedDate) return 'later';
    parsedDate.setHours(0, 0, 0, 0);

    if (parsedDate < today)                                    return 'earlier';
    if (parsedDate.getTime() === today.getTime())              return 'today';
    if (parsedDate.getTime() === tomorrow.getTime())           return 'tomorrow';
    if (parsedDate > tomorrow && parsedDate <= oneWeekLater)   return 'nextSevenDays';
    return 'later';
}

function parseDueDate(dateStr) {
    const currentYear    = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;
    let year, month, day;

    if (/^\d{6}$/.test(dateStr)) {
        year  = currentCentury + parseInt(dateStr.slice(0, 2));
        month = parseInt(dateStr.slice(2, 4)) - 1;
        day   = parseInt(dateStr.slice(4, 6));
    }
    else if (/^\d{2}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(dateStr)) {
        const p = dateStr.split(/[-\/]/);
        year  = currentCentury + parseInt(p[0]);
        month = parseInt(p[1]) - 1;
        day   = parseInt(p[2]);
    }
    else if (/^\d{1,2}[-\/]\d{1,2}$/.test(dateStr)) {
        const p = dateStr.split(/[-\/]/);
        year  = currentYear;
        month = parseInt(p[0]) - 1;
        day   = parseInt(p[1]);
    }
    else {
        return null;
    }
    return new Date(year, month, day);
}

function parseTime(timeStr) {
    if (!timeStr) return null;
    let hours, minutes;

    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
        const parts = timeStr.split(':');
        hours   = parseInt(parts[0]);
        minutes = parseInt(parts[1]);
    } else if (/^\d{3}$/.test(timeStr)) {
        hours   = parseInt(timeStr.slice(0, 1));
        minutes = parseInt(timeStr.slice(1, 3));
    } else if (/^\d{4}$/.test(timeStr)) {
        hours   = parseInt(timeStr.slice(0, 2));
        minutes = parseInt(timeStr.slice(2, 4));
    } else {
        return null;
    }

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return { hours, minutes };
    }
    return null;
}

function formatTime(timeStr) {
    const parsed = parseTime(timeStr);
    if (!parsed) return timeStr;
    return `${parsed.hours}:${String(parsed.minutes).padStart(2, '0')}`;
}

/**
 * @summary Determines time blocking state (Past/Current/Future).
 * @description Compares current time with task start and end times.
 *              End time is assumed to be the start time of the next task.
 * @param {string} timeStr - Task start time.
 * @returns {'timePast'|'timeCurrent'|'timeFuture'}
 */
function getTimeBlockStatus(timeStr) {
    const parsed = parseTime(timeStr);
    if (!parsed) return 'timeFuture';

    const taskMinutes = parsed.hours * 60 + parsed.minutes;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const idx = SORTED_TIME_SLOTS.indexOf(taskMinutes);
    if (idx === -1) return 'timeFuture';

    // End time is the next task's start time, or 24:00 if last task
    const endMinutes = idx + 1 < SORTED_TIME_SLOTS.length
        ? SORTED_TIME_SLOTS[idx + 1]
        : 24 * 60;

    if (currentMinutes < taskMinutes) return 'timeFuture';
    if (currentMinutes < endMinutes)  return 'timeCurrent';
    return 'timePast';
}

function storeImage(fileName) {
    const directoryName = 'Images';
    const path = iCloud.joinPath(iCloud.joinPath(iCloud.documentsDirectory(), directoryName), fileName);

    if (iCloud.fileExists(path)) {
        return iCloud.readImage(path);
    } else {
        console.error(`Image file not found: ${path}`);
        return null;
    }
}