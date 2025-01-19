import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { ethers } from "ethers";

function TableAdmin({
  header,
  data,
  type,
}: {
  header: string[];
  data: any;
  type: string;
}) {
  console.log(data);
  const list = useMemo(() => {
    if (type == "station") {
      return (
        <TableBody>
          {data &&
            data.length > 0 &&
            data.map((item: any, index: any) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.orderCount}</TableCell>
                <TableCell>{item.validators}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      );
    }
    if (type == "staff") {
      return (
        <TableBody>
          {data &&
            data.length > 0 &&
            data.map((item: any, index: any) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.orderCount}</TableCell>
                <TableCell>
                  <i className="fa-regular fa-circle-check text-green-400"></i>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          <TableRow>
            <TableCell>Not found</TableCell>
          </TableRow>
        </TableBody>
      );
    }
  }, [type, data]);

  return (
    <Table>
      <TableHeader className="flex justify-between items-center">
        {header.map((item, index) => {
          return <TableColumn key={index}>{item}</TableColumn>;
        })}
      </TableHeader>
      {list}
    </Table>
  );
}

export default TableAdmin;
