import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, CreditCard, Loader2 } from "lucide-react";
import type { Invoice, Transaction } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface BillingSectionProps {
  customerId: string;
}

export function BillingSection({ customerId }: BillingSectionProps) {
  const { data: invoicesData, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["/api/customers", customerId, "invoices"],
    queryFn: async () => {
      const response = await fetch(`/api/customers/${customerId}/invoices`);
      const data = await response.json();
      return data.success ? data.data : [];
    },
  });

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["/api/customers", customerId, "transactions"],
    queryFn: async () => {
      const response = await fetch(`/api/customers/${customerId}/transactions`);
      const data = await response.json();
      return data.success ? data.data : [];
    },
  });

  const invoices: Invoice[] = invoicesData || [];
  const transactions: Transaction[] = transactionsData || [];
  const formatCurrency = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
      case 'confirmed':
        return 'bg-yellow-500';
      case 'failed':
      case 'cancelled':
        return 'bg-red-500';
      case 'sent':
        return 'bg-blue-500';
      case 'overdue':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    // TODO: Implement PDF generation/download
    console.log("Downloading invoice:", invoice.invoiceNumber);
  };

  return (
    <div className="space-y-6">
      {/* Invoices Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle>Invoices</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingInvoices ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                          data-testid={`download-invoice-${invoice.invoiceNumber}`}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No invoices yet</p>
          )}
        </CardContent>
      </Card>

      {/* Payment History Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <CardTitle>Payment History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.billingDate).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="capitalize">{transaction.type.replace('_', ' ')}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusLabel(transaction.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
