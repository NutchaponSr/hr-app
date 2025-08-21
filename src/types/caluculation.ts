/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertAmountFromUnit } from "@/lib/utils";
import { Calculator, Hash, Percent } from "lucide-react";

type CountCalculationType = "count-all" | "count-nonempty" | "count-empty" | "count-unique" | "count-values";
type PercentCalculationType = "percent-nonempty" | "percent-empty";
type MoreCalculationType = "sum" | "average" | "median" | "min" | "max" | "range";

export type CalculationType = CountCalculationType | PercentCalculationType | MoreCalculationType;

interface ColumnStats {
  totalCount: number
  nonEmptyCount: number
  emptyCount: number
  uniqueCount: number
  sum: number | null
  average: number | null
  median: number | null
  min: number | null
  max: number | null
  range: number | null
  isNumeric: boolean
}

export const COUNT_OPTIONS = [
  { value: "count-all", label: "All", icon: Hash },
  { value: "count-nonempty", label: "Values", icon: Hash },
  { value: "count-empty", label: "Empty", icon: Hash },
  { value: "count-unique", label: "Unique", icon: Hash },
] as const

export const PERCENT_OPTIONS = [
  { value: "percent-nonempty", label: "% Not Empty", icon: Percent },
  { value: "percent-empty", label: "% Empty", icon: Percent },
] as const

export const MORE_OPTIONS = [
  { value: "sum", label: "Sum", icon: Calculator },
  { value: "average", label: "Average", icon: Calculator },
  { value: "median", label: "Median", icon: Calculator },
  { value: "min", label: "Min", icon: Calculator },
  { value: "max", label: "Max", icon: Calculator },
  { value: "range", label: "Range", icon: Calculator },
] as const

export const ALL_CALCULATION_OPTIONS = [
  ...COUNT_OPTIONS,
  ...PERCENT_OPTIONS,
  ...MORE_OPTIONS,
]

const isEmptyValue = (value: any): boolean => {
  return value === null || value === undefined || value === ""
}

const isNumericValue = (value: any): boolean => {
  return typeof value === "number" && !isNaN(value)
}

const calculateMedian = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

export const calculateColumnStats = (values: any[]): ColumnStats => {
  const totalCount = values.length
  const nonEmptyValues = values.filter(val => !isEmptyValue(val))
  const emptyCount = totalCount - nonEmptyValues.length
  const uniqueValues = [...new Set(nonEmptyValues)]
  const uniqueCount = uniqueValues.length

  const numericValues = nonEmptyValues.filter(isNumericValue)
  const isNumeric = numericValues.length > 0

  let sum = null
  let average = null
  let median = null
  let min = null
  let max = null
  let range = null

  if (isNumeric && numericValues.length > 0) {
    sum = numericValues.reduce((acc, val) => acc + val, 0)
    average = sum / numericValues.length
    median = calculateMedian(numericValues)
    min = Math.min(...numericValues)
    max = Math.max(...numericValues)
    range = max - min
  }

  return {
    totalCount,
    nonEmptyCount: nonEmptyValues.length,
    emptyCount,
    uniqueCount,
    sum,
    average,
    median,
    min,
    max,
    range,
    isNumeric,
  }
}

export const getCalculationValue = (stats: ColumnStats, calculation: CalculationType): string => {
  switch (calculation) {
    // Count Category
    case "count-all":
      return stats.totalCount.toString()
    case "count-nonempty":
      return stats.nonEmptyCount.toString()
    case "count-empty":
      return stats.emptyCount.toString()
    case "count-unique":
      return stats.uniqueCount.toString()

    // Percent Category
    case "percent-nonempty":
      return stats.totalCount > 0
        ? `${((stats.nonEmptyCount / stats.totalCount) * 100).toFixed(1)}%`
        : "0%"
    case "percent-empty":
      return stats.totalCount > 0
        ? `${((stats.emptyCount / stats.totalCount) * 100).toFixed(1)}%`
        : "0%"

    // More Category (Statistical)
    case "sum":
      if (stats.isNumeric && stats.sum !== null) {
        const convertedSum = convertAmountFromUnit(stats.sum, 2)?.toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
        return convertedSum ? convertedSum.toLocaleString() : "N/A";
      }
      return "N/A"
    case "average":
      return stats.isNumeric && stats.average !== null ? stats.average.toFixed(2) : "N/A"
    case "median":
      return stats.isNumeric && stats.median !== null ? stats.median.toFixed(2) : "N/A"
    case "min":
      return stats.isNumeric && stats.min !== null ? stats.min.toString() : "N/A"
    case "max":
      return stats.isNumeric && stats.max !== null ? stats.max.toString() : "N/A"
    case "range":
      return stats.isNumeric && stats.range !== null ? stats.range.toFixed(2) : "N/A"

    default:
      return stats.totalCount.toString()
  }
}