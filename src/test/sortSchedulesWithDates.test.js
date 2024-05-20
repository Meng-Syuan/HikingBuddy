import sortSchedulesWithDates from '../utils/sortSchedulesWithDates';
import { describe, test, expect } from '@jest/globals';

describe('sortSchedulesWithDates', () => {
  test('should sort future schedules by lastDay in ascending order', () => {
    const futureSchedules = [
      {
        id: 'testFuture_1',
        firstDay: 1717689600000,
        lastDay: 1717776000000,
        lastDay_formate: '6/8',
        tripName: 'testFuture_1',
        isChecklistConfirmed: false,
      },
      {
        id: 'testFuture_2',
        firstDay: 1734537600000,
        lastDay: 1734624000000,
        lastDay_formate: '12/20',
        tripName: 'testFuture_2',
        isChecklistConfirmed: false,
      },
      {
        id: 'testFuture_3',
        firstDay: 1722268800000,
        lastDay: 1722355200000,
        lastDay_formate: '7/31',
        tripName: 'testFuture_3',
        isChecklistConfirmed: false,
      },
      {
        id: 'testFuture_4',
        firstDay: 1721404800000,
        lastDay: 1721491200000,
        lastDay_formate: '7/20',
        tripName: 'testFuture_4',
        isChecklistConfirmed: false,
      },
    ];
    const pastSchedules = [];
    const result = sortSchedulesWithDates(futureSchedules, pastSchedules);

    expect(result.futureSchedules).toEqual([
      {
        id: 'testFuture_1',
        firstDay: 1717689600000,
        lastDay: 1717776000000,
        lastDay_formate: '6/8',
        tripName: 'testFuture_1',
        isChecklistConfirmed: false,
      },
      {
        id: 'testFuture_4',
        firstDay: 1721404800000,
        lastDay: 1721491200000,
        lastDay_formate: '7/20',
        tripName: 'testFuture_4',
        isChecklistConfirmed: false,
      },
      {
        id: 'testFuture_3',
        firstDay: 1722268800000,
        lastDay: 1722355200000,
        lastDay_formate: '7/31',
        tripName: 'testFuture_3',
        isChecklistConfirmed: false,
      },
      {
        id: 'testFuture_2',
        firstDay: 1734537600000,
        lastDay: 1734624000000,
        lastDay_formate: '12/20',
        tripName: 'testFuture_2',
        isChecklistConfirmed: false,
      },
    ]);
  });

  test('should sort past schedules by lastDay in descending order', () => {
    const futureSchedules = [];
    const pastSchedules = [
      {
        id: 'testPast_1',
        firstDay: 1704038400000,
        lastDay: 1704211200000,
        lastDay_formate: '1/3',
        tripName: 'testPast_1',
      },
      {
        id: 'testPast_2',
        firstDay: 1715097600000,
        lastDay: 1715184000000,
        lastDay_formate: '5/9',
        tripName: 'testPast_2',
      },
      {
        id: 'testPast_3',
        firstDay: 1706745600000,
        lastDay: 1707177600000,
        lastDay_formate: '2/6',
        tripName: 'testPast_3',
      },
      {
        id: 'testPast_4',
        firstDay: 1710979200000,
        lastDay: 1711065600000,
        lastDay_formate: '3/22',
        tripName: 'testPast_4',
      },
    ];

    const result = sortSchedulesWithDates(futureSchedules, pastSchedules);

    expect(result.pastSchedules).toEqual([
      {
        id: 'testPast_2',
        firstDay: 1715097600000,
        lastDay: 1715184000000,
        lastDay_formate: '5/9',
        tripName: 'testPast_2',
      },
      {
        id: 'testPast_4',
        firstDay: 1710979200000,
        lastDay: 1711065600000,
        lastDay_formate: '3/22',
        tripName: 'testPast_4',
      },
      {
        id: 'testPast_3',
        firstDay: 1706745600000,
        lastDay: 1707177600000,
        lastDay_formate: '2/6',
        tripName: 'testPast_3',
      },
      {
        id: 'testPast_1',
        firstDay: 1704038400000,
        lastDay: 1704211200000,
        lastDay_formate: '1/3',
        tripName: 'testPast_1',
      },
    ]);
  });

  test('should handle empty future / past schedules', () => {
    const futureSchedules = [];
    const pastSchedules = [];
    const result = sortSchedulesWithDates(futureSchedules, pastSchedules);
    expect(result.futureSchedules).toEqual([]);
    expect(result.pastSchedules).toEqual([]);
  });
});
