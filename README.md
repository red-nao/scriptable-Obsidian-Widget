# Obsidian Widget for Scriptable

This Scriptable script displays your Obsidian notes on iOS/iPadOS Home Screen widgets. Beyond simple note display, it features an intelligent **Time Blocking system** that analyzes task times to visualize "what you need to do right now."

![screenshot](.readme-images/screenshot01.png)

## Features

- **Markdown Support**: Renders headings (`#`), ToDo lists (`- [ ]`), bullet points, and numbered lists.
- **Time Blocking (New!)**: Analyzes time stamps within tasks and automatically color-codes them as "Past (Finished)," "Present (In-progress)," or "Future (Upcoming)" based on the current time.
- **Auto-Sorting (New!)**: Regardless of the order written in your note, tasks are automatically sorted by time to create a chronological schedule.
- **Date/Time Badges (New!)**: Displays deadlines and times as visual badges. Badge colors change dynamically based on proximity (e.g., Yesterday, Today, Tomorrow, or within 7 days).
- **Unscheduled Section (New!)**: Tasks without specific time stamps are moved to an "Unscheduled" section, clearly separating your fixed schedule from your general ToDo list.
- **Multi-format Date Support (New!)**: Supports various date formats (MM/DD, YY/MM/DD, etc.) and provides localized display for "Today," "Tomorrow," and days of the week.
- **Obsidian Integration**: Tap the widget to open the specific note directly in the Obsidian app.

## Setup & Installation

### Step 1: Download and Placement

1. Download the files from this repository.
2. Install the `obsidian_widget.js` script into the Scriptable app.
3. Place the `Images` folder directly under the Scriptable folder in your iCloud Drive.

    ```
    iCloud Drive
    └── Scriptable
        ├── obsidian_widget.js   (The script)
        └── Images               (Place this folder here)
            ├── 0.png
            ...
            └── square.png
    ```

### Step 2: Configure Scriptable File Bookmarks

Register the folder containing your Markdown files in Scriptable.

1. Open the Scriptable app, tap the gear icon (Settings) in the top-left, and go to **File Bookmarks**.
2. Tap **Add Bookmark** and select the folder where your Obsidian Vault or notes are stored.
3. Enter a **Bookmark Name** (e.g., `inbox`) and save it. You will use this name in the next step.

> **Note**
> While designed for Obsidian, this script works with any folder containing Markdown files.

### Step 3: Edit the Script

Open `obsidian_widget.js` and configure the following:

1. **`BOOKMARKED_FOLDER_NAME`**
   Set this to the bookmark name you created in Step 2.
   ```javascript
   const BOOKMARKED_FOLDER_NAME = 'inbox';
   ```

2. **`FILE_NAME_RUNS_IN_APP`**
   The file name used for testing when running the script inside the Scriptable app (without the `.md` extension).
   ```javascript
   const FILE_NAME_RUNS_IN_APP = 'example';
   ```

3. **Device and Character Settings**
   Configure these at the top of the script for proper layout and line wrapping.
   ```javascript
   const isPhone = true; // Set to `true` for iPhone, `false` for iPad.
   const USE_FULL_WIDTH_CHARS = false; // Set to `true` if your notes primarily use full-width characters (Japanese, Chinese, Korean, etc.).
   ```

### Step 4: Add Widget to Home Screen

1. Long-press your Home Screen and tap the "+" icon.
2. Select **Scriptable** and choose your preferred widget size.
3. Long-press the added widget and select **Edit Widget**.
    - **Script**: Select `obsidian_widget`.
    - **Parameter**: Enter the filename of the note you want to display (without the `.md` extension).

## Date and Time Syntax

The script automatically recognizes dates and times written at the end of a task line.

- **Time Recognition**: `13:00`, `1300`, `9:30`, etc.
    - Example: `- [ ] Meeting 14:00`
- **Date Recognition**: `MM/DD`, `YY/MM/DD`, `YYMMDD`, etc.
    - Example: `- [ ] Deadline 04/15`
- **Combinations**: 
    - Example: `- [ ] Submit Report 04/13 15:00`

> **Note**: When a time is recognized, "Time Blocking Mode" activates, and the task will be highlighted (e.g., in blue) if it is currently ongoing.

## Customization

You can customize the appearance by editing the `== Basic Display Settings ==` and `== Color and Style Settings ==` sections at the top of the script.

### Basic Display Settings

| Constant | Description |
| :--- | :--- |
| `isPhone` | Adjusts layout/margins for iPhone (`true`) or iPad (`false`). |
| `USE_FULL_WIDTH_CHARS` | Improves line-wrap accuracy for CJK (Chinese, Japanese, Korean) characters. |
| `FONT_SIZE` | Sets the base font size for the widget. |
| `LINE_SPACING` | Sets the numerical spacing between lines. |
| `PARTITION_STRING` | Text after this string (default `---`) will be hidden in the widget. |
| `SHOW_FIRSTLINE_AS_PLAINTEXT` | If `true`, the first line uses standard styling. If `false`, special header styling is applied. |
| `SHOW_FILENAME_ON_FIRSTLINE` | Displays the file name on the first line of the widget. |
| `SHOW_TASK_NUMBER` | Displays the count of incomplete tasks next to the file name. |

### Time Blocking Settings

| Constant | Description |
| :--- | :--- |
| `USE_JAPANESE_TIME_FORMAT` | If `true`, displays relative dates and days of the week in Japanese. |
| `AUTO_SORT_BY_TIME` | If `true`, tasks are sorted chronologically. If `false`, they appear in the order written. |

### Color and Style Settings

| Constant | Description |
| :--- | :--- |
| `DARK_BACKGROUND_COLOR` | Hex color code for the widget background in Dark Mode. |
| `LIGHT_BACKGROUND_COLOR` | Hex color code for the widget background in Light Mode. |
| `FIRST_LINE_COLOR_LIGHT` | Text color for the first line in Light Mode. |
| `FIRST_LINE_COLOR_DARK` | Text color for the first line in Dark Mode. |

### Advanced Styling (`CONFIG` object)

- **Element Styles**: You can adjust `fontSizeScale` and colors for `h1`, `h2`, `url`, etc., for both light and dark modes.
    > **Warning**: Changing `fontSizeScale` may affect the accuracy of line-wrapping calculations.
- **Badge Styles**: Adjust the colors and transparency for `dueDateTime` badges.
    - `timeCurrent`: Highlight color for ongoing tasks.
    - `timePast`: Subdued color for finished tasks.
    - `earlier`: Alert color for overdue tasks.
- **Checkbox Style**: The default is a circle. To use a square, edit the `addListMarker` function and ensure `square.png` is in your `Images` folder.

## Important Notes

- **File Hierarchy**: The script only supports files located **directly within** the folder specified in File Bookmarks. Subfolders are not supported.
- **Time Blocking Logic**: A task's "End Time" is assumed to be the "Start Time" of the next task. The final task of the day remains "Current" until 24:00.

## Acknowledgments

This script was built based on the following projects:

- Poppo (ぽっぽ): [Displaying Obsidian Notes on Home Screen with Scriptable](https://note.com/walking_poppo/n/n31e5ef576e72)
- Angus Thompson: [obsidian-scriptable-tasks-widget](https://github.com/angus-thompson/obsidian-scriptable-tasks-widget)