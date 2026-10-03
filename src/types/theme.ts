/** A Core Learning theme strip. Data-driven: add/remove/rename/reorder in data/themes. */
export interface ThemeDefinition {
  id: string;
  label: string;
  /** Short line shown when the strip is open. */
  line: string;
  /** CSS colour tokens (var names without `--`). */
  color: string;
  ink: string;
  /** Doodle icon key (components/scrapbook/Doodle). */
  doodle: string;
  order: number;
  activityIds: string[];
  /** Hidden themes are kept in data but not shown. */
  hidden?: boolean;
}
