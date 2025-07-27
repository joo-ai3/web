import React from 'react';
import { ShoppingBag, Heart, Star, Truck, Shield, Headphones } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import SectionTitle from '../components/SectionTitle';

export default function Home() {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Shipping",
      description: "Free shipping on orders over $50"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payment",
      description: "100% secure payment processing"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round the clock customer support"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Headphones",
      price: 299,
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199,
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.6
    },
    {
      id: 3,
      name: "Wireless Speaker",
      price: 149,
      image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to Soleva
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Discover premium products with cutting-edge design and unmatched quality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlassButton size="lg" className="px-8 py-4">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Now
            </GlassButton>
            <GlassButton variant="secondary" size="lg" className="px-8 py-4">
              Explore Collections
            </GlassButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            title="Why Choose Soleva" 
            subtitle="Experience the difference with our premium service"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassCard key={index} className="text-center p-8">
                <div className="text-blue-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle 
            title="Featured Products" 
            subtitle="Handpicked items just for you"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <GlassCard key={product.id} className="overflow-hidden group cursor-pointer">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-300 ml-2">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      ${product.price}
                    </span>
                    <div className="flex gap-2">
                      <GlassButton size="sm">
                        <Heart className="w-4 h-4" />
                      </GlassButton>
                      <GlassButton size="sm">
                        <ShoppingBag className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Experience Premium Quality?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied customers who trust Soleva for their premium needs
            </p>
            <GlassButton size="lg" className="px-12 py-4">
              Start Shopping
            </GlassButton>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}