import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Skeleton,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CloseIcon from "@mui/icons-material/Close";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

import { AppDispatch, RootState } from "../store/store";
import { fetchProducts, fetchOffers, fetchAds } from "../slice/shopSlice";

import "./Home.css";

type ItemKind = "product" | "offer" | "ad";

interface DisplayItem {
  kind: ItemKind;
  id: number;
  title: string;
  subtitle?: string;
  meta?: string;
  image_url?: string | null;
}

function toDisplayItems(
  products: any[],
  offers: any[],
  ads: any[],
): { productItems: DisplayItem[]; offerItems: DisplayItem[] } {
  const productBase: DisplayItem[] = (products || [])
    .filter((p) => p?.is_active)
    .map((p) => ({
      kind: "product",
      id: p.id,
      title: p.name,
      subtitle: p.brand,
      meta:
        p.price != null
          ? `₹${Number(p.price).toLocaleString("en-IN")}`
          : undefined,
      image_url: p.image_url,
    }));

  const offerBase: DisplayItem[] = (offers || [])
    .filter((o) => o?.is_active)
    .map((o) => ({
      kind: "offer",
      id: o.id,
      title: o.offer_title,
      subtitle: o.target_product ? `For ${o.target_product}` : undefined,
      meta: o.discount != null ? `${o.discount}% off` : undefined,
      image_url: o.image_url,
    }));

  const adBase: DisplayItem[] = (ads || [])
    .filter((a) => a?.is_active)
    .map((a) => ({
      kind: "ad",
      id: a.id,
      title: a.ad_title,
      subtitle: a.placement,
      meta: "Sponsored",
      image_url: a.image_url,
    }));

  return {
    productItems: shuffle([...productBase, ...adBase]),
    offerItems: shuffle([...offerBase, ...adBase]),
  };
}
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function ItemCard({ item }: { item: DisplayItem }) {
  const kindLabel =
    item.kind === "product"
      ? "Product"
      : item.kind === "offer"
        ? "Offer"
        : "Ad";
  const kindColor =
    item.kind === "product"
      ? "primary"
      : item.kind === "offer"
        ? "success"
        : "secondary";

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: "0 8px 24px -8px rgba(0,0,0,0.18)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",

          aspectRatio: "4 / 3",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.image_url ? (
          <CardMedia
            component="img"
            image={item.image_url}
            alt={item.title}
            sx={{
              width: "100%",
              height: "100%",

              objectFit: "contain",
              p: 1,
            }}
          />
        ) : (
          <ImageNotSupportedIcon sx={{ fontSize: 40 }} color="disabled" />
        )}
        <Chip
          size="small"
          label={kindLabel}
          color={kindColor as any}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            fontWeight: 700,
            borderRadius: 1.5,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.title}
        </Typography>
        {item.subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.subtitle}
          </Typography>
        )}
      </CardContent>

      {item.meta && (
        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {item.meta}
          </Typography>
        </CardActions>
      )}
    </Card>
  );
}

function CardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Skeleton
        variant="rectangular"
        sx={{ aspectRatio: "4 / 3", width: "100%" }}
      />
      <CardContent>
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="40%" />
      </CardContent>
    </Card>
  );
}

function ItemGrid({
  items,
  loading,
}: {
  items: DisplayItem[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <Grid container spacing={2.5}>
        {[...Array(4)].map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <CardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Nothing to show here yet.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {items.map((item) => (
        <Grid key={`${item.kind}-${item.id}`} size={{ xs: 12, sm: 6, md: 3 }}>
          <ItemCard item={item} />
        </Grid>
      ))}
    </Grid>
  );
}

function ProductsOffersTabs({
  productItems,
  offerItems,
  loading,
}: {
  productItems: DisplayItem[];
  offerItems: DisplayItem[];
  loading: boolean;
}) {
  const [tab, setTab] = useState<"product" | "offer">("product");
  const items = tab === "product" ? productItems : offerItems;

  return (
    <Box sx={{ mb: { xs: 5, md: 7 } }}>
      <Stack direction="row" spacing={1} sx={{ mb: { xs: 2.5, md: 3 } }}>
        <Chip
          label="Product"
          onClick={() => setTab("product")}
          color={tab === "product" ? "primary" : "default"}
          variant={tab === "product" ? "filled" : "outlined"}
          sx={{
            fontWeight: 700,
            borderRadius: 2.5,
            px: 1.5,
            height: 36,
            fontSize: "0.9rem",
          }}
        />
        <Chip
          label="Offers"
          onClick={() => setTab("offer")}
          color={tab === "offer" ? "success" : "default"}
          variant={tab === "offer" ? "filled" : "outlined"}
          sx={{
            fontWeight: 700,
            borderRadius: 2.5,
            px: 1.5,
            height: 36,
            fontSize: "0.9rem",
          }}
        />
      </Stack>

      <ItemGrid items={items} loading={loading} />
    </Box>
  );
}

const SESSION_POPUP_KEY = "ts_home_popup_shown";

function WelcomePopup({
  productItems,
  offerItems,
  loading,
}: {
  productItems: DisplayItem[];
  offerItems: DisplayItem[];
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_POPUP_KEY);
    if (!alreadyShown) {
      setOpen(true);
      sessionStorage.setItem(SESSION_POPUP_KEY, "1");
    }
  }, []);

  const preview = useMemo(
    () => [...productItems.slice(0, 2), ...offerItems.slice(0, 2)],
    [productItems, offerItems],
  );

  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: 4 } } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Take a look at what's trending
        <IconButton onClick={handleClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          A quick peek at some products, offers, and ads from our sellers. Sign
          in or create an account to explore everything.
        </Typography>

        {loading ? (
          <Grid container spacing={1.5}>
            {[...Array(4)].map((_, i) => (
              <Grid key={i} size={{ xs: 6 }}>
                <CardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={1.5}>
            {preview.map((item) => (
              <Grid key={`${item.kind}-${item.id}`} size={{ xs: 6 }}>
                <ItemCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleClose}
            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700 }}
          >
            Browse as guest
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn: boolean = !!localStorage.getItem("token");

  const { products, offers, ads, listLoading } = useSelector(
    (state: RootState) => state.shop,
  ) as any;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOffers());
    dispatch(fetchAds());
  }, [dispatch]);

  const { productItems, offerItems } = useMemo(
    () => toDisplayItems(products, offers, ads),
    [products, offers, ads],
  );

  const loading = Boolean(listLoading);

  if (!isLoggedIn) {
    return (
      <Box className="home-wrapper">
        <WelcomePopup
          productItems={productItems}
          offerItems={offerItems}
          loading={loading}
        />

        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <RocketLaunchIcon
              sx={{
                fontSize: { xs: 48, md: 64 },
                color: "primary.main",
                mb: 2,
              }}
            />
            <Typography
              component="h1"
              gutterBottom
              className="hero-title"
              sx={{ typography: { xs: "h3", md: "h2" } }}
            >
              Welcome to TripSaver
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                maxWidth: 600,
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Discover incredible products. Connect with trusted sellers.
              Experience e-commerce done right.
            </Typography>
          </Box>

          <Grid
            container
            spacing={{ xs: 3, md: 4 }}
            sx={{ justifyContent: "center", mb: { xs: 7, md: 9 } }}
          >
            <Grid size={{ xs: 12, sm: 8, md: 6 }}>
              <Card elevation={3} className="action-card">
                <CardContent
                  sx={{ flexGrow: 1, textAlign: "center", p: { xs: 3, md: 4 } }}
                >
                  <LoginIcon
                    sx={{
                      fontSize: { xs: 40, md: 48 },
                      color: "primary.main",
                      mb: 2,
                    }}
                  />
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: "bold" }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Welcome back! Sign in to track your orders, manage your
                    listings, and continue exploring the marketplace
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "center", pb: { xs: 3, md: 4 } }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<LoginIcon />}
                    onClick={() => navigate("/login")}
                    className="pill-button"
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    Sign In
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 8, md: 6 }}>
              <Card elevation={3} className="action-card">
                <CardContent
                  sx={{ flexGrow: 1, textAlign: "center", p: { xs: 3, md: 4 } }}
                >
                  <PersonAddIcon
                    sx={{
                      fontSize: { xs: 40, md: 48 },
                      color: "secondary.main",
                      mb: 2,
                    }}
                  />
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: "bold" }}
                  >
                    Join Us Today
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    New here? Create an account to discover amazing products,
                    save your favorite finds, or even start selling your own.
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "center", pb: { xs: 3, md: 4 } }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate("/register")}
                    className="pill-button pill-button-outlined"
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    Create Account
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          <ProductsOffersTabs
            productItems={productItems}
            offerItems={offerItems}
            loading={loading}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <ProductsOffersTabs
          productItems={productItems}
          offerItems={offerItems}
          loading={loading}
        />
      </Container>
    </Box>
  );
};

export default Home;
