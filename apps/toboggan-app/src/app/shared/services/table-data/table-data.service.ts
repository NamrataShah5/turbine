/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import {
  SingleHeaderRowTableDataGenerator,
  TableColumnDisplayMetadatum,
  TableDataGenerator,
  TableRow
} from '@snhuproduct/toboggan-ui-components-library';
import { Observable, Subscription } from 'rxjs';
import { TableSortingService } from '../table-sorting/table-sorting.service';

export interface ITableRowFilterFunc {
  (
    tr: TableRow,
    columnMetadata?: TableColumnDisplayMetadatum[],
    searchVal?: unknown
  ): boolean;
}
export interface ITableFilter {
  dataKey?: string;
  items?: ITableFilterItems[];
  title?: string;
  type?: string;
}
export interface ITableFilterItems {
  dataKey?: string;
  itemText?: string;
  id?: string;
  checked?: boolean;
}
export interface ICelldataFormatterFunc {
  (dataArray: unknown): TableRow[];
}

export interface ITableDataGeneratorFactoryOutput {
  dataGenerator: SingleHeaderRowTableDataGenerator;
  tableRows?: TableRow[];
  rawData?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  constructor(private tablesortingService: TableSortingService) { }

  private prevSearchString = '';
  private defaultFilterFunc(
    tr: TableRow,
    columnMetadata: TableColumnDisplayMetadatum[],
    searchString: string
  ): boolean {
    const colsToMatch: string[] = columnMetadata
      .filter(
        (aColMetadataObj: TableColumnDisplayMetadatum) =>
          aColMetadataObj.searchableField
      )
      .map(
        (aColMetadataObj: TableColumnDisplayMetadatum) =>
          aColMetadataObj.dataKey
      );
    return colsToMatch.reduce(
      (prevBool: boolean, currKey: string) =>
        prevBool ||
        new RegExp(searchString, 'i').test(tr.cellData[currKey].toString()),
      false
    );
  }

  public dataGeneratorFactoryObs(
    rowsObservable: Observable<unknown>,
    columnMetadata: TableColumnDisplayMetadatum[],
    cellDataFormatterFunc: ICelldataFormatterFunc,
    rowsPerPage: number,
    currentPageNumer: number,
    updateFunc = () => { },
    additionalFilterFuncs: ITableRowFilterFunc[] = [],
    filtersSelected: ITableFilterItems[] = [],
    done = () => { },
  ): Observable<ITableDataGeneratorFactoryOutput> {
    return new Observable((observer) => {
      let rowsObservableSubscription: Subscription;
      let tableRefreshed = false;
      const tableDataGeneratorFactoryOutput: ITableDataGeneratorFactoryOutput =
      {
        dataGenerator: {} as TableDataGenerator,
        tableRows: [],
        rawData: {},
      };
      tableDataGeneratorFactoryOutput.dataGenerator =
        new SingleHeaderRowTableDataGenerator(
          // retrieveRowData
          (
            dataGenerator: TableDataGenerator,
            columnDisplayMetadata: TableColumnDisplayMetadatum[],
            _searchString: string = dataGenerator.searchString,
            _pageSize: number = rowsPerPage,
            currentPage: number = currentPageNumer
          ) => {
            rowsObservableSubscription = rowsObservable.subscribe((rows) => {
              if (rows) {
                done();
              }
              let pageNumber = currentPage; // for normal pagination
              if (!tableRefreshed) {
                // if table refreshed
                pageNumber = currentPageNumer;
              }
              if (this.prevSearchString != _searchString) {
                this.prevSearchString = _searchString;
                pageNumber = currentPageNumer;
              }
              dataGenerator.isFiltered = true;
              const tableRows = cellDataFormatterFunc(rows);
              tableDataGeneratorFactoryOutput.rawData = rows;
              const { sortColumnDataKey, sortDirectionCoefficient } =
                this.tablesortingService.getSortDirectionCoefficient(
                  columnMetadata
                );
              const filterFuncs = [
                this.defaultFilterFunc,
                ...additionalFilterFuncs,
              ];
              let sortedAndFilteredRows = filterFuncs
                .reduce(
                  (prevFilteredRows, currentFilterFunc) =>
                    prevFilteredRows.filter((aRow) =>
                      currentFilterFunc(
                        aRow,
                        columnDisplayMetadata,
                        dataGenerator.searchString
                      )
                    ),
                  tableRows
                )
                .sort((a, b) =>
                  this.tablesortingService.sortOnDatakeynCoeff(
                    a,
                    b,
                    sortColumnDataKey,
                    sortDirectionCoefficient
                  )
                );
              if (filtersSelected.length) {
                sortedAndFilteredRows = sortedAndFilteredRows.filter((row) =>
                  Object.entries(row.cellData).some(([key, value]) =>
                    filtersSelected.some(
                      (filter) =>
                        filter.dataKey === key &&
                        JSON.stringify(value).includes(filter.itemText || '') && filter.checked
                    )
                  )
                );
              }

              tableDataGeneratorFactoryOutput.tableRows = sortedAndFilteredRows;
              const startRow = (pageNumber - 1) * rowsPerPage;
              const pageData = sortedAndFilteredRows.slice(
                startRow,
                startRow + rowsPerPage
              );
              dataGenerator.retrievalCallback(
                pageData,
                sortedAndFilteredRows.length,
                pageNumber,
                Math.ceil(sortedAndFilteredRows.length / rowsPerPage)
              );
              observer.next(tableDataGeneratorFactoryOutput);
              tableRefreshed = true;
            });
          },
          // updateRow
          updateFunc,
          columnMetadata
        );
      observer.next(tableDataGeneratorFactoryOutput);
      return {
        unsubscribe() {
          rowsObservableSubscription.unsubscribe();
        },
      };
    });
  }
  //function to set up filters in assessment table
  setFiltersInTable(assessmentList: TableRow[], dataGenerator: TableDataGenerator) {
    return dataGenerator.columnMetadata
      .filter((column) => column.hasOwnProperty('filterable'))
      .map(column => ({
        dataKey: column.dataKey,
        title: column.title,
        type: "checkbox",
        items: assessmentList
          .reduce((acc, curr) => {
            let value = '' as never;
            if (column.dataKey == 'result') {
              const data = curr.cellData[column.dataKey] as any;
              value = data['value'] as never;
            }
            else {
              value = curr.cellData[column.dataKey] as never;
            }
            if (!acc.includes(value)) {
              acc.push(value);
            }
            return acc;
          }, [])
          .map((filter, index) => ({
            itemText: filter,
            id: `${index + 1}`
          })),
      }));
  }
}
