import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, MapPin, Users, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-encontro.jpg";
import Footer from "@/components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/30"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-float">
            O Momento é Agora:
            <span className="block text-3xl md:text-5xl mt-2 text-yellow-200">
              Um Encontro Transformador Te Espera!
            </span>
          </h1>
          
          <Card className="mt-8 bg-white/95 backdrop-blur-sm shadow-divine">
            <CardContent className="p-8 text-left">
              <p className="text-lg leading-relaxed text-foreground mb-6">
                Você sente um chamado? A Bíblia nos diz: <strong>"Eis agora o tempo sobremodo oportuno, eis agora o dia da salvação." (2 Coríntios 6:2)</strong>
              </p>
              
              <p className="text-lg leading-relaxed text-foreground mb-6">
                Deus tem algo especial e único reservado para você neste momento da sua vida. Prepare-se para três dias de profunda conexão, revelação e renovação.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary text-xl">Nosso Encontro com Deus será uma oportunidade para você:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>Descobrir o plano de Deus para sua vida</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>Experimentar Sua presença de forma pessoal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>Encontrar respostas e direção para seus desafios</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Data do Evento</span>
                    </div>
                    <p className="text-lg font-bold text-primary">29 a 31 de Agosto</p>
                  </div>
                  
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Investimento</span>
                    </div>
                    <p className="text-lg font-bold text-primary">R$ 200,00</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded mb-6">
                <p className="font-semibold text-primary mb-2">Não deixe para depois o que Deus quer fazer em você agora.</p>
                <p className="text-lg font-bold">Invista em Sua Transformação!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Payment Information Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-divine bg-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center text-primary mb-8">
                Informações de Pagamento
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-glow p-6 rounded-lg text-center">
                    <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-2xl font-bold text-primary mb-2">R$ 200,00</p>
                    <p className="text-lg">Valor do Investimento</p>
                  </div>
                  
                  <div className="bg-accent/30 p-6 rounded-lg">
                    <h3 className="font-bold text-primary mb-4 text-xl">Como Pagar (Via PIX):</h3>
                    <div className="bg-white p-4 rounded border-2 border-primary/20">
                      <p className="text-sm text-muted-foreground mb-2">Chave PIX:</p>
                      <p className="font-mono text-lg font-bold text-primary break-all">
                        📧 videiraosascoencontro@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg">
                    <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                      <span className="text-2xl">⚠️</span>
                      Atenção Crucial:
                    </h3>
                    <p className="text-yellow-800 font-semibold">
                      É crucial que você use apenas esta chave PIX. Não utilize chaves antigas, pois elas não são válidas para este Encontro.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-primary">Prazo Final:</h4>
                        <p>Pagamentos aceitos até <strong>quarta-feira, 27 de agosto de 2025</strong></p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-primary">Confirmação:</h4>
                        <p>Após o pagamento, envie o comprovante para seu discipulador, líder de célula ou pessoa que te convidou.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">
            Sua jornada de fé e transformação começa aqui.
          </h2>
          
          <div className="space-y-4">
            <Link to="/whatsapp-confirmation">
              <Button variant="divine" size="lg" className="w-full max-w-md text-xl py-6">
                Entrar no Grupo WhatsApp
              </Button>
            </Link>
            
            <Link to="/inscription">
              <Button variant="outline" size="lg" className="w-full max-w-md">
                Já estou no grupo ou quero fazer a inscrição direta
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;