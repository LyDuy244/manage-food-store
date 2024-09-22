import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { getTableLink } from "@/lib/utils";
export default function QRcodeTable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    // Hiện tại thư viện QR code sẽ vẽ lên canvas
    // Bây giờ ta sẽ tạo  1 thẻ canvas ảo để thư thư viên QR code vẽ canvas lên trên đó
    // và ta sẽ edit thẻ canvas thật
    // cuối cùng ta sẽ đưa thẻ canvas ảo chứa QR code ở trên vào thẻ canvas thật
    const canvas = canvasRef.current!;
    canvas.height = width + 70;
    canvas.width = width;
    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "20px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "#000";
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    );

    canvasContext.fillText(
      `Quét mã QR để gọi món`,
      canvas.width / 2,
      canvas.width + 50
    );
    const virtualCanvas = document.createElement("canvas");
    QRCode.toCanvas(
      virtualCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      function (error: any) {
        if (error) console.error(error);
        canvasContext.drawImage(virtualCanvas, 0, 0, width, width);
      }
    );
  }, [tableNumber, token, width]);
  return <canvas ref={canvasRef}></canvas>;
}
