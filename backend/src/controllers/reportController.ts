import { Request, Response, NextFunction } from "express";
import * as reportService from "../services/reportService";

export async function getReportsDataHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { period } = req.query;
    const data = await reportService.getReportsData(period as string);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function getTopEventsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { period } = req.query;
    const events = await reportService.getTopEvents(period as string);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
}

export async function getSalesChartHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { period } = req.query;
    const chartData = await reportService.getSalesChart(period as string);
    res.status(200).json(chartData);
  } catch (error) {
    next(error);
  }
}