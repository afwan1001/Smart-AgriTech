import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgriTechPlatform() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [products] = useState([
    { id: 1, name: "Organic Fertilizer", price: 250 },
    { id: 2, name: "Smart Sprayer", price: 1800 },
    { id: 3, name: "Neem Pesticide", price: 150 },
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">🌾 Smart AgriTech Platform</h1>
      <Tabs defaultValue="detect" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="detect">🌿 Disease Detector</TabsTrigger>
          <TabsTrigger value="shop">🛒 E-Commerce Store</TabsTrigger>
        </TabsList>

        <TabsContent value="detect">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && <img src={preview} alt="Preview" className="w-60 h-60 object-cover rounded-xl" />}
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Analyzing..." : "Detect Disease"}
              </Button>
              {result && (
                <div className="text-center mt-4">
                  <h2 className="text-xl font-semibold">Diagnosis:</h2>
                  <p className="text-green-700 font-bold">{result.disease}</p>
                  <h3 className="text-lg mt-2">Suggested Treatment:</h3>
                  <p className="text-gray-700">{result.treatment}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shop">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4 flex flex-col justify-between">
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">Price: ₹{product.price}</p>
                  <Button>Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
