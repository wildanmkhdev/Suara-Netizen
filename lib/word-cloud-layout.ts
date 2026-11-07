import type { WordFrequencyItem } from '@/lib/judol-keywords';

export type WordCloudCategory = NonNullable<WordFrequencyItem['category']> | 'unknown';

export interface WordCloudWord {
  id: string;
  text: string;
  value: number;
  category: WordCloudCategory;
}

export interface MeasuredWord {
  width: number;
  height: number;
  baselineX: number;
  baselineY: number;
}

export interface PlacedWord extends WordCloudWord {
  size: number;
  x: number;
  y: number;
}

export interface WordCloudLayout {
  width: number;
  height: number;
  words: PlacedWord[];
  omittedCount: number;
}

interface WordCloudLayoutOptions {
  width: number;
  height: number;
  measure: (text: string, size: number) => MeasuredWord;
}

interface WordBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const WORD_CLOUD_LIMIT = 60;
const MIN_FONT_SIZE = 16;
const SEARCH_STEPS = 640;
const PADDING = 6;

/**
 * Places frequency-sorted words using real font measurements. Work is bounded to
 * 60 words, three sizes and 640 spiral positions per size. Unplaced words remain
 * in the caller's complete frequency table rather than becoming unreadably small.
 * Coordinates are alphabetic baselines, shared by the SVG and PNG renderers.
 */
export function layoutWordCloud(
  words: readonly WordCloudWord[],
  { width, height, measure }: WordCloudLayoutOptions,
): WordCloudLayout {
  const placedWords: PlacedWord[] = [];
  const boxes: WordBox[] = [];
  const candidateCount = Math.min(words.length, WORD_CLOUD_LIMIT);
  const maxFontSize = width < 480 ? 36 : 54;
  let minValue = Infinity;
  let maxValue = 0;

  for (let index = 0; index < candidateCount; index += 1) {
    minValue = Math.min(minValue, words[index].value);
    maxValue = Math.max(maxValue, words[index].value);
  }

  for (let index = 0; index < candidateCount; index += 1) {
    const word = words[index];
    const proportion = maxValue === minValue
      ? 0.5
      : (word.value - minValue) / (maxValue - minValue);
    const desiredSize = Math.round(MIN_FONT_SIZE + Math.sqrt(proportion) * (maxFontSize - MIN_FONT_SIZE));
    const sizes = [desiredSize, Math.max(MIN_FONT_SIZE, Math.round(desiredSize * 0.8)), MIN_FONT_SIZE];
    let placed = false;

    for (let pass = 0; pass < sizes.length && !placed; pass += 1) {
      const size = sizes[pass];
      if (pass > 0 && size === sizes[pass - 1]) continue;

      const measurement = measure(word.text, size);
      const boxWidth = Math.ceil(measurement.width) + PADDING * 2;
      const boxHeight = Math.ceil(measurement.height) + PADDING * 2;
      if (boxWidth > width - PADDING * 2 || boxHeight > height - PADDING * 2) continue;

      for (let step = 0; step < SEARCH_STEPS; step += 1) {
        const radius = step / (SEARCH_STEPS - 1);
        const angle = step * 0.45 + index * 2.399963;
        const x = width / 2 + Math.cos(angle) * radius * (width / 2 - PADDING) - boxWidth / 2;
        const y = height / 2 + Math.sin(angle) * radius * (height / 2 - PADDING) - boxHeight / 2;
        if (x < PADDING || y < PADDING || x + boxWidth > width - PADDING || y + boxHeight > height - PADDING) continue;

        let overlaps = false;
        for (const box of boxes) {
          if (x < box.x + box.width && x + boxWidth > box.x && y < box.y + box.height && y + boxHeight > box.y) {
            overlaps = true;
            break;
          }
        }
        if (overlaps) continue;

        boxes.push({ x, y, width: boxWidth, height: boxHeight });
        placedWords.push({
          ...word,
          size,
          x: x + PADDING + measurement.baselineX,
          y: y + PADDING + measurement.baselineY,
        });
        placed = true;
        break;
      }
    }
  }

  return { width, height, words: placedWords, omittedCount: words.length - placedWords.length };
}
