import React, { useState } from 'react';
import { MapPin, Heart, Mail, Check, X, AlertCircle } from 'lucide-react';
import { Button, Badge, Heading, Subheading, BodyText, Caption, AccentText, Card, BrowserCard, Input, Textarea, Select, Checkbox } from '../components/ui';
import SEO from '../components/SEO';

const DesignSystem: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1');
  const [checked, setChecked] = useState(false);

  return (
    <div className="min-h-screen bg-brand-linen">
      <SEO 
        title="Design System" 
        description="Commons Youth Platform Design System & Brand Guidelines"
      />
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-obsidian to-brand-ocean text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="warning" mono className="mb-4">v1.0.0</Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 uppercase">Design System</h1>
          <p className="text-xl text-brand-mist max-w-2xl mx-auto">
            COMMONS YOUTH Brand Identity Guidelines (2026)
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {/* Color Palette */}
        <section>
          <Heading className="text-4xl mb-8">Color Palette</Heading>
          
          <div className="space-y-8">
            <div>
              <Subheading className="text-2xl mb-4">Core Colors (60% Usage)</Subheading>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ColorSwatch name="Linen" hex="#FAF6E2" bg="bg-brand-linen" border="border-brand-obsidian" />
                <ColorSwatch name="Obsidian" hex="#161716" bg="bg-brand-obsidian" text="text-white" />
                <ColorSwatch name="Burnt Orange" hex="#EC6839" bg="bg-brand-orange" text="text-white" />
                <ColorSwatch name="Bud Green" hex="#B5D340" bg="bg-brand-bud" />
                <ColorSwatch name="Amber Brown" hex="#C06F2D" bg="bg-brand-amber" text="text-white" />
              </div>
            </div>

            <div>
              <Subheading className="text-2xl mb-4">Topic Colors (30% Usage)</Subheading>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <ColorSwatch name="Forest" hex="#137B48" bg="bg-brand-forest" text="text-white" />
                <ColorSwatch name="Ocean" hex="#172F56" bg="bg-brand-ocean" text="text-white" />
                <ColorSwatch name="Raspberry" hex="#E25072" bg="bg-brand-raspberry" text="text-white" />
                <ColorSwatch name="Orchid" hex="#D15ECB" bg="bg-brand-orchid" text="text-white" />
                <ColorSwatch name="Morning" hex="#F1F98A" bg="bg-brand-morning" />
                <ColorSwatch name="Mist" hex="#CBEAF1" bg="bg-brand-mist" />
              </div>
            </div>

            <div>
              <Subheading className="text-2xl mb-4">Utility Colors (10% Usage)</Subheading>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <ColorSwatch name="Earth" hex="#6B6B6B" bg="bg-brand-earth" text="text-white" />
                <ColorSwatch name="Gray" hex="#E5E5E5" bg="bg-brand-gray" />
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <Heading className="text-4xl mb-8">Typography</Heading>
          
          <Card variant="elevated" className="space-y-6">
            <div>
              <Caption className="mb-2 text-brand-earth uppercase tracking-wider">Main Heading (Anuphan Bold, ALL CAPS)</Caption>
              <Heading className="text-5xl">เสริมพลังเยาวชน</Heading>
            </div>

            <div>
              <Caption className="mb-2 text-brand-earth uppercase tracking-wider">Subheading (Anuphan Semibold, 65% of heading)</Caption>
              <Subheading className="text-3xl">ร่วมสร้างพื้นที่กลาง</Subheading>
            </div>

            <div>
              <Caption className="mb-2 text-brand-earth uppercase tracking-wider">Body Text (Anuphan Regular, 42% of heading, +2pt leading)</Caption>
              <BodyText className="text-lg">
                เชื่อมต่อกับกลุ่มเยาวชน ค้นหากิจกรรม และแสดงพลังของคนรุ่นใหม่ทั่วประเทศไทย
              </BodyText>
            </div>

            <div>
              <Caption className="mb-2 text-brand-earth uppercase tracking-wider">Caption (Anuphan Light, 78.85% of body)</Caption>
              <Caption>ข้อมูลเพิ่มเติมและรายละเอียดปลีกย่อย</Caption>
            </div>

            <div>
              <Caption className="mb-2 text-brand-earth uppercase tracking-wider">Accent Text (PT Mono)</Caption>
              <AccentText className="text-4xl">200+ Members</AccentText>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section>
          <Heading className="text-4xl mb-8">Buttons</Heading>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <Subheading className="text-xl mb-4">Variants</Subheading>
              <div className="space-y-3">
                <Button variant="primary" fullWidth>Primary Button</Button>
                <Button variant="secondary" fullWidth>Secondary Button</Button>
                <Button variant="outline" fullWidth>Outline Button</Button>
                <Button variant="danger" fullWidth>Danger Button</Button>
              </div>
            </Card>

            <Card>
              <Subheading className="text-xl mb-4">Sizes & States</Subheading>
              <div className="space-y-3">
                <Button variant="primary" size="lg" fullWidth>Large Button</Button>
                <Button variant="primary" size="md" fullWidth>Medium Button</Button>
                <Button variant="primary" size="sm" fullWidth>Small Button</Button>
                <Button variant="primary" icon={MapPin} fullWidth>With Icon</Button>
                <Button variant="primary" loading fullWidth>Loading...</Button>
                <Button variant="primary" disabled fullWidth>Disabled</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section>
          <Heading className="text-4xl mb-8">Badges</Heading>
          
          <Card>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="primary" mono>123</Badge>
              <Badge variant="success" icon={Check}>Completed</Badge>
              <Badge variant="danger" icon={X}>Failed</Badge>
            </div>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <Heading className="text-4xl mb-8">Cards</Heading>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="default">
              <Subheading className="text-xl mb-2">Default Card</Subheading>
              <BodyText className="text-brand-earth">Basic card with border</BodyText>
            </Card>

            <Card variant="elevated">
              <Subheading className="text-xl mb-2">Elevated Card</Subheading>
              <BodyText className="text-brand-earth">With retro shadow effect</BodyText>
            </Card>

            <Card variant="outlined" className="bg-brand-linen">
              <Subheading className="text-xl mb-2">Outlined Card</Subheading>
              <BodyText className="text-brand-earth">Transparent background</BodyText>
            </Card>
          </div>

          <div className="mt-6">
            <BrowserCard url="commons-youth.org/groups/123">
              <div className="p-6">
                <Subheading className="text-xl mb-2">Browser Card</Subheading>
                <BodyText className="text-brand-earth">
                  Special card with browser-style window controls
                </BodyText>
              </div>
            </BrowserCard>
          </div>
        </section>

        {/* Form Inputs */}
        <section>
          <Heading className="text-4xl mb-8">Form Inputs</Heading>
          
          <Card className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="We'll never share your email"
              required
            />

            <Input
              label="With Error"
              type="text"
              placeholder="Enter text"
              error="This field is required"
              required
            />

            <Textarea
              label="Description"
              placeholder="Tell us about your group..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              helperText="Maximum 500 characters"
            />

            <Select
              label="Select Province"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { value: 'option1', label: 'กรุงเทพมหานคร' },
                { value: 'option2', label: 'เชียงใหม่' },
                { value: 'option3', label: 'ภูเก็ต' },
              ]}
              required
            />

            <Checkbox
              label="I agree to the terms and conditions"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          </Card>
        </section>

        {/* Icons & Patterns */}
        <section>
          <Heading className="text-4xl mb-8">Icons & Patterns</Heading>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <Subheading className="text-xl mb-4">Icon Usage</Subheading>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-brand-bud rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-brand-obsidian" />
                </div>
                <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-brand-ocean rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card>
              <Subheading className="text-xl mb-4">Shadow Styles</Subheading>
              <div className="space-y-4">
                <div className="p-4 bg-white border-2 border-brand-obsidian shadow-retro">
                  Retro Shadow
                </div>
                <div className="p-4 bg-white border-2 border-brand-obsidian shadow-retro-sm">
                  Retro Shadow Small
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Component Examples */}
        <section>
          <Heading className="text-4xl mb-8">Real-World Examples</Heading>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature Card Example */}
            <Card variant="elevated">
              <div className="w-16 h-16 bg-brand-linen rounded-full flex items-center justify-center mb-4 border-2 border-brand-obsidian">
                <MapPin className="w-8 h-8 text-brand-bud" />
              </div>
              <Subheading className="text-2xl mb-3">Explore Map</Subheading>
              <BodyText className="text-brand-earth mb-4">
                Discover youth groups across Thailand and connect with local communities
              </BodyText>
              <Button variant="secondary" size="sm" icon={MapPin} iconPosition="right">
                View Map
              </Button>
            </Card>

            {/* Stat Card Example */}
            <Card className="text-center bg-brand-obsidian text-white">
              <AccentText className="text-5xl text-brand-bud mb-2">200+</AccentText>
              <Caption className="text-brand-linen opacity-80">Active Members</Caption>
              <div className="mt-4 pt-4 border-t border-white/20">
                <BodyText className="text-brand-linen/80">
                  Join our growing community
                </BodyText>
              </div>
            </Card>
          </div>
        </section>

        {/* Design Principles */}
        <section>
          <Heading className="text-4xl mb-8">Design Principles</Heading>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <Badge variant="primary" className="mb-4">60%</Badge>
              <Subheading className="text-xl mb-2">Base Colors</Subheading>
              <BodyText className="text-brand-earth">
                Linen and Obsidian dominate backgrounds and text
              </BodyText>
            </Card>

            <Card>
              <Badge variant="success" className="mb-4">30%</Badge>
              <Subheading className="text-xl mb-2">Brand Colors</Subheading>
              <BodyText className="text-brand-earth">
                Bud Green, Orange, and Amber for primary elements
              </BodyText>
            </Card>

            <Card>
              <Badge variant="warning" className="mb-4">10%</Badge>
              <Subheading className="text-xl mb-2">Accent Colors</Subheading>
              <BodyText className="text-brand-earth">
                Topic colors used sparingly for highlights
              </BodyText>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
};

// Helper Component
const ColorSwatch: React.FC<{ name: string; hex: string; bg: string; text?: string; border?: string }> = ({ 
  name, 
  hex, 
  bg, 
  text = 'text-brand-obsidian',
  border = 'border-brand-gray'
}) => {
  return (
    <div className={`${bg} ${border} border-2 rounded-xl p-4 transition-transform hover:scale-105`}>
      <div className={`${text} font-bold mb-1`}>{name}</div>
      <div className={`${text} opacity-70 text-sm font-mono`}>{hex}</div>
    </div>
  );
};

export default DesignSystem;
