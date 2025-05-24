import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { grey, red } from "@mui/material/colors";

const PriceTable = ({ prices, onDelete, onEdit }) => {
  const today = new Date().setHours(0,0,0,0);

  // Filter prices to exclude those with deleted_at set
  const filteredPrices = prices.filter((price) => !price.deleted_at);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Effective Date</TableCell>
            <TableCell>Priest Honorarium</TableCell>
            <TableCell>Priest's Contingency</TableCell>
            <TableCell>Annual Festival Expenses</TableCell>
            <TableCell>Maintenance</TableCell>
            <TableCell>Endowment</TableCell>
            <TableCell>Miscellaneous</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPrices.map((price) => {
            const effectiveDate = new Date(price.effectiveDate);
            const isPast = effectiveDate < today;

            return (
              <TableRow 
              key={price.id}
              style={{
                backgroundColor: isPast ? grey[400] : "white"
              }}
              >
                <TableCell>{price.effectiveDate}</TableCell>
                <TableCell>{price.priestsHonorarium}</TableCell>
                <TableCell>{price.priests_contingency}</TableCell>
                <TableCell>{price.annualExpenses}</TableCell>
                <TableCell>{price.maintenance}</TableCell>
                <TableCell>{price.endowment}</TableCell>
                <TableCell>{price.miscellaneous}</TableCell>
                <TableCell>
                  {price.priestsHonorarium +
                    price.priests_contingency+
                    price.annualExpenses +
                    price.maintenance +
                    price.endowment +
                    price.miscellaneous}
                </TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(price)} disabled={isPast}>
                    <EditIcon />
                  </Button>
                  <Button onClick={() => onDelete(price.id)} disabled={isPast}>
                    <DeleteIcon sx={{ color: !isPast ? red[500] : grey[500]}} />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PriceTable;
