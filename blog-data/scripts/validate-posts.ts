import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DATA_DIR = path.resolve(import.meta.dirname, "..");

const REQUIRED_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "author",
  "date",
  "category",
  "tags",
] as const;

interface ValidationError {
  file: string;
  field: string;
  message: string;
}

function validatePost(filePath: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const relative = path.relative(BLOG_DATA_DIR, filePath);

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      errors.push({
        file: relative,
        field,
        message: `Missing required field: ${field}`,
      });
    }
  }

  // Validate slug format
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push({
      file: relative,
      field: "slug",
      message: `Slug must be lowercase alphanumeric with hyphens: "${data.slug}"`,
    });
  }

  // Validate excerpt length
  if (data.excerpt && data.excerpt.length > 200) {
    errors.push({
      file: relative,
      field: "excerpt",
      message: `Excerpt too long (${data.excerpt.length} chars, max 200)`,
    });
  }

  // Validate tags is an array
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push({
      file: relative,
      field: "tags",
      message: "Tags must be an array",
    });
  }

  // Validate date format
  if (data.date) {
    const dateStr =
      typeof data.date === "object"
        ? (data.date as Date).toISOString()
        : String(data.date);
    if (isNaN(new Date(dateStr).getTime())) {
      errors.push({
        file: relative,
        field: "date",
        message: `Invalid date format: "${data.date}"`,
      });
    }
  }

  return errors;
}

function main() {
  console.log("Validating blog posts...\n");
  const allErrors: ValidationError[] = [];
  let postCount = 0;

  const entries = fs.readdirSync(BLOG_DATA_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith("blogs")) continue;

    const folderPath = path.join(BLOG_DATA_DIR, entry.name);
    const postEntries = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const postEntry of postEntries) {
      if (!postEntry.isDirectory() || !postEntry.name.startsWith("post"))
        continue;

      const postMdPath = path.join(folderPath, postEntry.name, "post.md");

      if (!fs.existsSync(postMdPath)) {
        allErrors.push({
          file: `${entry.name}/${postEntry.name}/post.md`,
          field: "file",
          message: "post.md file not found",
        });
        continue;
      }

      postCount++;
      const errors = validatePost(postMdPath);
      allErrors.push(...errors);
    }
  }

  // Report results
  console.log(`Validated ${postCount} posts\n`);

  if (allErrors.length === 0) {
    console.log("All posts are valid!");
    process.exit(0);
  } else {
    console.error(`Found ${allErrors.length} validation error(s):\n`);
    for (const error of allErrors) {
      console.error(`  ${error.file}`);
      console.error(`    [${error.field}] ${error.message}\n`);
    }
    process.exit(1);
  }
}

main();
