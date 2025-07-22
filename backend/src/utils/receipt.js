const generateReceipt = (orderDetails) => {
    const { orderId, items, totalAmount, customerName, date } = orderDetails;

    let receipt = `Receipt\n`;
    receipt += `Order ID: ${orderId}\n`;
    receipt += `Customer Name: ${customerName}\n`;
    receipt += `Date: ${date}\n\n`;
    receipt += `Items:\n`;

    items.forEach(item => {
        receipt += `- ${item.name} (Quantity: ${item.quantity}, Price: $${item.price})\n`;
    });

    receipt += `\nTotal Amount: $${totalAmount}\n`;

    return receipt;
};

const downloadReceipt = (receiptContent, filename) => {
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};

module.exports = {
    generateReceipt,
    downloadReceipt
};