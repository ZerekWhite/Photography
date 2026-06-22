import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTriggers: ScrollTrigger[] = [];

      // Left column animation
      if (leftRef.current) {
        const st = ScrollTrigger.create({
          trigger: leftRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              leftRef.current,
              { x: -60, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }
            );
          },
        });
        scrollTriggers.push(st);
      }

      // Right column animation
      if (rightRef.current) {
        const st = ScrollTrigger.create({
          trigger: rightRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              rightRef.current,
              { x: 60, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.1 }
            );

            // Form inputs stagger
            const inputs = rightRef.current?.querySelectorAll('.form-input');
            if (inputs) {
              gsap.fromTo(
                inputs,
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.4,
                  stagger: 0.1,
                  ease: 'expo.out',
                  delay: 0.3,
                }
              );
            }

            // Submit button
            const button = rightRef.current?.querySelector('.submit-btn');
            if (button) {
              gsap.fromTo(
                button,
                { scale: 0 },
                {
                  scale: 1,
                  duration: 0.5,
                  ease: 'elastic.out(1, 0.5)',
                  delay: 0.6,
                }
              );
            }
          },
        });
        scrollTriggers.push(st);
      }

      // Bottom row animation
      if (bottomRef.current) {
        const st = ScrollTrigger.create({
          trigger: bottomRef.current,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            // Divider line
            const divider = bottomRef.current?.querySelector('.divider');
            if (divider) {
              gsap.fromTo(
                divider,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  duration: 0.8,
                  ease: 'expo.out',
                  delay: 0.5,
                }
              );
            }

            // Social icons
            const icons = bottomRef.current?.querySelectorAll('.social-icon');
            if (icons) {
              gsap.fromTo(
                icons,
                { scale: 0 },
                {
                  scale: 1,
                  duration: 0.3,
                  stagger: 0.08,
                  ease: 'elastic.out(1, 0.5)',
                  delay: 0.7,
                }
              );
            }

            // Copyright
            const copyright = bottomRef.current?.querySelector('.copyright');
            if (copyright) {
              gsap.fromTo(
                copyright,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.9 }
              );
            }
          },
        });
        scrollTriggers.push(st);
      }

      return () => {
        scrollTriggers.forEach((st) => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const socialLinks = [
    { name: 'QQ', icon: MessageCircle, href: '#' },
    { name: 'WeChat', icon: MessageCircle, href: '#' },
    { name: 'Behance', icon: MessageCircle, href: '#' },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 lg:py-40 bg-background"
    >
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Left Column */}
          <div ref={leftRef} className="opacity-0">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white mb-6">
              想要合作？
            </h3>
            <p className="text-base text-white/60 mb-8 leading-relaxed">
              如果您有项目想要讨论，或者只是想打个招呼，欢迎随时联系我。我期待与您的交流。
            </p>
            
            <div className="space-y-4">
              <div className="input-underline relative">
                <input
                  type="email"
                  placeholder="输入您的邮箱"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div ref={rightRef} className="opacity-0">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white mb-6">
              给我留言
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-input input-underline relative opacity-0">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="您的姓名"
                  required
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors duration-300"
                />
              </div>
              
              <div className="form-input input-underline relative opacity-0">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="您的邮箱"
                  required
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors duration-300"
                />
              </div>
              
              <div className="form-input input-underline relative opacity-0">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="您的留言"
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors duration-300 resize-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`submit-btn w-full sm:w-auto px-8 py-3 bg-white text-black text-sm uppercase tracking-wider font-medium rounded flex items-center justify-center gap-2 hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitted ? 'bg-green-500 text-white' : ''
                }`}
                style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">发送中...</span>
                ) : isSubmitted ? (
                  <span>发送成功!</span>
                ) : (
                  <>
                    <span>发送消息</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row */}
        <div ref={bottomRef}>
          {/* Divider */}
          <div className="divider w-full h-px bg-white/10 mb-8 origin-center" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="social-icon w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-black hover:bg-white hover:scale-110 hover:rotate-12 transition-all duration-300"
                  style={{ transitionTimingFunction: 'var(--ease-elastic)' }}
                  title={link.name}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
            
            {/* Copyright */}
            <p className="copyright text-sm text-white/40">
              © 2024 cacao。保留所有权利。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
